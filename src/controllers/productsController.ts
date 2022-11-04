import { Request, Response, NextFunction } from 'express';

import config from '../utils/config';
import Product from '../models/productModel';
import { catchAsync } from '../utils/catchAsync';
import { toNewProductEntry } from '../utils/tsUtils';
import {
  INewProductEntry,
  IProduct,
  IUpdateProductEntry,
} from '../utils/tsTypes';

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
  async (req: Request, res: Response, _next: NextFunction) => {
    const product: INewProductEntry = toNewProductEntry(req.body);
    const newProduct = await Product.create(product);
    res.status(201).json({
      status: 'success',
      data: {
        data: newProduct,
      },
    });
  }
);

const deleteAllDevProducts = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.body.deleteAll === 'true' && config.NODE_ENV === 'dev') {
      await Product.deleteMany({});
      res.status(204).json({
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
    const deleted = Product.findByIdAndDelete(req.params.id);
    if (!deleted) {
      next(new Error('No product was found with given ID - no delete'));
    }
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
      return next(new Error('No document found with that ID')); //404
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
