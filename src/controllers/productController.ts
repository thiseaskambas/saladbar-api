import { Request, Response, NextFunction } from 'express';
import cloudinary, { options } from '../utils/cloudinary';
import formidable from 'formidable';
import config from '../utils/config';
import Product from '../models/productModel';
import { catchAsync } from '../utils/catchAsync';
import { toNewProductEntry } from '../tsUtils/builders';
import { INewProductEntry, IProduct, IUpdateProductEntry } from '../tsTypes';
// import { parseName } from '../tsUtils/parsers';
import { AppError } from '../utils/appError';
import { ErrorStatusCode } from '../tsTypes/error.types';
import Cart from '../models/cartModel';

//controllers for baseURL
const getAllProducts = catchAsync(
  async (_req: Request, res: Response, _next: NextFunction) => {
    const allProducts = await Product.find({});
    res.status(200).json({
      status: 'success',
      data: {
        data: allProducts,
      },
    });
  }
);

const createProduct = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const form = formidable({
      keepExtensions: true,
      maxFiles: 1,
      filename: (name, _ext) => {
        return name;
      },
      maxFileSize: 52428800, // 50MB in bytes
    });

    form.on('error', (err: Error) => {
      new AppError({
        name: err.name || 'Form Error',
        message: err.message,
        statusCode: ErrorStatusCode.BAD_REQUEST,
      });
      next(err);
    });

    form.parse(req, async (_err, fields, files) => {
      let savedImage = null;
      try {
        savedImage = await cloudinary.uploader.upload(
          (<any>files)?.image?.filepath,
          {
            ...options,

            gravity: 'auto',
            height: 100,
            width: 200,
            crop: 'fill',
            //NOTE: https://console.cloudinary.com/documentation/webpurify_image_moderation_addon?customer_external_id=75e9038568056c9a66455c5ff1b728&frameless=1
            // moderation: 'webpurify', //NOTE: only 50 free requests per day
          }
        );
      } catch (err) {
        return next(
          new AppError({
            message: 'Image could not be saved',
            statusCode: ErrorStatusCode.INTERNAL_SERVER_ERROR,
          })
        );
      }

      try {
        const product: INewProductEntry = toNewProductEntry(fields, savedImage);
        const newProduct = await Product.create(product);

        res.status(201).json({
          status: 'success',
          data: {
            data: newProduct,
          },
        });
      } catch (err) {
        try {
          cloudinary.uploader.destroy(savedImage.public_id);
        } catch (errCloud) {
          next(errCloud);
        }
        next(err);
      }
    });
  }
);

const deleteAllDevProducts = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.body.deleteAll === 'true' && config.NODE_ENV === 'dev') {
      await Product.deleteMany({});
      try {
        const result = await cloudinary.api.delete_resources_by_prefix(
          'saladBarDev/'
        );
        console.log({ result });
      } catch (err) {
        next(err);
      }
      return res.status(204).json({
        status: 'success',
        data: null,
      });
    }
    return next(new Error('Could NOT delete'));
  }
);

const getProductById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const found: IProduct | null = await Product.findById(req.params.id);
    if (!found) {
      return next(
        new AppError({
          message: 'Product not found',
          statusCode: ErrorStatusCode.NOT_FOUND,
        })
      );
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: found,
      },
    });
  }
);

const deactivateOneProduct = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const deactivated = await Product.findByIdAndUpdate(
      req.params.id,
      {
        active: false,
      },
      { new: true }
    );
    if (!deactivated) {
      return next(
        new AppError({
          message: 'Could not deactivate',
          statusCode: ErrorStatusCode.INTERNAL_SERVER_ERROR,
        })
      );
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  }
);

const deleteOneProduct = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const foundCart = await Cart.findOne({ 'items.product': req.params.id });

    if (foundCart) {
      return next(
        new AppError({
          name: 'UsedProduct',
          statusCode: ErrorStatusCode.BAD_REQUEST,
          message: `Warning: the product you are trying to delete is present in a cart created on ${foundCart.createdAt}`,
          additionalInfo: {
            foundCart,
          },
        })
      );
    }
    const deleted = await Product.findOneAndRemove({
      _id: req.params.id,
      // active: true,
    });

    if (!deleted) {
      return next(
        new AppError({
          message:
            'No delete: make sure ID is correct and that the product was deactivated',
          statusCode: ErrorStatusCode.BAD_REQUEST, // OR INTERNAL ?
        })
      );
    }

    cloudinary.uploader.destroy(deleted.image.public_id);
    res.status(204).json({
      status: 'success',
      data: null,
    });
  }
);

const editProduct = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const form = formidable({
      keepExtensions: true,
      maxFiles: 1,
      filename: (name, _ext) => {
        return name;
      },
    });
    form.parse(req, async (err, fields, files) => {
      if (err) return next(err);
      const productToUpdate: IProduct | null = await Product.findById(
        req.params.id
      );
      if (!productToUpdate) {
        return next(
          new AppError({
            message: 'Product not found',
            statusCode: ErrorStatusCode.NOT_FOUND,
          })
        );
      }

      //TODO: refactor with try catch block
      let savedImage = null;
      if (files?.image) {
        try {
          savedImage = await cloudinary.uploader.upload(
            (<any>files)?.image?.filepath,
            {
              ...options,
              gravity: 'auto',
              height: 100,
              width: 200,
              crop: 'fill',
              //NOTE: https://console.cloudinary.com/documentation/webpurify_image_moderation_addon?customer_external_id=75e9038568056c9a66455c5ff1b728&frameless=1
              // moderation: 'webpurify', //NOTE: only 50req per day are free to purify images
            }
          );
        } catch (err) {
          return next(
            new AppError({
              message: 'Image could not be saved',
              statusCode: ErrorStatusCode.INTERNAL_SERVER_ERROR,
            })
          );
        }
      }

      const prevImage = Object.create(productToUpdate.image);
      const entriesToBeSaved: IUpdateProductEntry = {
        ...fields,
        image: savedImage
          ? {
              url: savedImage.url,
              secure_url: savedImage.secure_url,
              filename: savedImage['original_filename'],
              public_id: savedImage.public_id,
            }
          : productToUpdate.image,
      };

      Object.assign(productToUpdate, entriesToBeSaved);
      const updated = await productToUpdate.save();

      if (updated && savedImage) {
        try {
          cloudinary.uploader.destroy(prevImage.public_id);
        } catch (err) {
          next(err);
          console.log(err);
        }
      }

      res.status(200).json({
        status: 'success',
        data: {
          data: updated,
        },
      });
    });
  }
);

export default {
  getAllProducts,
  createProduct,
  deleteAllDevProducts,
  getProductById,
  deleteOneProduct,
  editProduct,
  deactivateOneProduct,
};
