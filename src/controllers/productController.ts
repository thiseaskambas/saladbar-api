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
    const form = formidable({});
    form.parse(req, async (err, fields, files) => {
      if (err) return next(err);
      const found: IProduct | null = await Product.findOne({
        name: parseName(fields.name),
      });
      if (found) {
        return next(new Error('Product name already exists'));
      }

      const result = await cloudinary.uploader.upload(
        (<any>files).image.filepath,
        options
      );
      console.log({ result });
      const product: INewProductEntry = toNewProductEntry(fields, result);

      const newProduct = await Product.create(product);
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

const deleteOneProduct = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return next(new Error('Error: no delete'));
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
    const { name, price, productCourseType, active }: IUpdateProductEntry =
      req.body;
    const edited: IProduct | null = await Product.findByIdAndUpdate(
      req.params.id,
      { name, price, productCourseType, active },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!edited) {
      return next(new Error('No product found with that ID')); //404
    }
    res.status(200).json({
      status: 'success',
      data: {
        data: edited,
      },
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
};
