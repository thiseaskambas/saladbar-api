import { Request, Response, NextFunction } from 'express';

import Product from '../models/productModel';
import { catchAsync } from '../utils/catchAsync';
import { toNewProductEntry } from '../utils/tsUtils';

const getAllProducts = catchAsync(
  async (_req: Request, res: Response, _next: NextFunction) => {
    const allProducts = await Product.find({});
    res.send(allProducts);
  }
);

const createProduct = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const product = toNewProductEntry(req.body);
    const newProduct = await Product.create(product);
    res.send(newProduct);
  }
);

export default { getAllProducts, createProduct };
