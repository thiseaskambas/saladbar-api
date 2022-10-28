import { Request, Response, NextFunction } from 'express';

import config from '../utils/config';
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

const deleteAllProduct = catchAsync(async (req: Request, res: Response) => {
  if (req.body.deleteAll === 'true' && config.NODE_ENV === 'dev') {
    await Product.deleteMany({});
    return res.send('deleted all products');
  }
  return res.send('no delete');
});

export default { getAllProducts, createProduct, deleteAllProduct };
