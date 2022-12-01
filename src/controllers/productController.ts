import { Request, Response, NextFunction } from 'express';
import cloudinary, { options } from '../utils/cloudinary';
import formidable from 'formidable';
import config from '../utils/config';
import Product from '../models/productModel';
import { catchAsync } from '../utils/catchAsync';
import { toNewProductEntry } from '../tsUtils/builders';
import { INewProductEntry, IProduct, IUpdateProductEntry } from '../tsTypes';
import { parseName } from '../tsUtils/parsers';

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
      filename: (name, ext) => {
        console.log({ ext });
        return name;
      },
    });
    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.log('error !', err);
        return next(err);
      }
      const found: IProduct | null = await Product.findOne({
        name: parseName(fields.name),
      });
      if (found) {
        return next(new Error('Product name already exists'));
      }
      console.log({ files });
      //TODO: refactor with try catch block
      const savedImage = await cloudinary.uploader.upload(
        (<any>files).image.filepath,
        {
          ...options,
          gravity: 'auto',
          height: 100,
          width: 200,
          crop: 'fill',
          //NOTE: https://console.cloudinary.com/documentation/webpurify_image_moderation_addon?customer_external_id=75e9038568056c9a66455c5ff1b728&frameless=1
          moderation: 'webpurify',
        }
      );

      const product: INewProductEntry = toNewProductEntry(fields, savedImage);

      const newProduct = await Product.create(product);
      console.log({ newProduct });
      res.status(201).json({
        status: 'success',
        data: {
          data: newProduct,
        },
      });
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
        console.log(err);
      }
      return res.status(204).json({
        status: 'success',
        data: null,
      });
    }
    return next(new Error('Could NOT delete'));
  }
);

//controllers for baseURL/:id
const getProductById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const found: IProduct | null = await Product.findById(req.params.id);
    if (!found) {
      return next(new Error('Could not find product'));
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
      return next(new Error('Error: could not deactivate'));
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  }
);

const deleteOneProduct = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const deleted = await Product.findOneAndDelete({
      id: req.params.id,
      active: false,
    });
    if (!deleted) {
      return next(
        new Error(
          'No delete: make sure ID is correct and that the product was deactivated'
        )
      );
    }
    cloudinary.uploader.destroy(deleted.image.filename);
    res.status(204).json({
      status: 'success',
      data: null,
    });
  }
);

const editProduct = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const form = formidable({});
    form.parse(req, async (err, fields, files) => {
      if (err) return next(err);
      const productToUpdate: IProduct | null = await Product.findById(
        req.params.id
      );
      if (!productToUpdate) {
        return next(new Error('No product found with that ID')); //404
      }

      //TODO: refactor with try catch block
      const savedImage = files.image
        ? await cloudinary.uploader.upload((<any>files).image.filepath, options)
        : null;

      const entriesToBeSaved: IUpdateProductEntry = {
        ...fields,
        image: savedImage
          ? {
              url: savedImage.url,
              secure_url: savedImage.secure_url,
              filename: savedImage.filename,
              public_id: savedImage.public_id,
            }
          : productToUpdate.image,
      };

      Object.assign(productToUpdate, entriesToBeSaved);
      const updated = await productToUpdate.save();
      if (updated && savedImage) {
        cloudinary.uploader.destroy(productToUpdate.image.filename);
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
