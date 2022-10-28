import { Response, Request, NextFunction } from 'express';

import Cart from '../models/cartModel';
import { ICart, INewCartEntry } from '../utils/tsTypes';
import { catchAsync } from '../utils/catchAsync';
import config from '../utils/config';
import { toNewCartEntry } from '../utils/tsUtils';

//controllers for baseURL
const getAllCarts = catchAsync(async (_req: Request, res: Response) => {
  const allCarts = await Cart.find({});
  res.status(200).json({
    status: 'success',
    data: {
      data: allCarts,
    },
  });
});

const createCart = catchAsync(async (req: Request, res: Response) => {
  const cart: INewCartEntry = toNewCartEntry(req.body);
  const savedCart: ICart = await Cart.create(cart);
  res.status(201).json({
    status: 'success',
    data: {
      data: savedCart,
    },
  });
});

const deleteAllCarts = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.body.deleteAll === 'true' && config.NODE_ENV === 'dev') {
      await Cart.deleteMany({});
      res.status(204).json({
        status: 'success',
        data: null,
      });
    }
    return next(new Error('Could NOT delete'));
  }
);

//controllers for baseURL/:id
const getCartById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const found = await Cart.findById(req.params.id);
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

const deleteOneCart = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const deleted = Cart.findByIdAndDelete(req.params.id);
    if (!deleted) {
      next(new Error('No document was found with given ID - no delete'));
    }
    res.status(204).json({
      status: 'success',
      data: null,
    });
  }
);

export default {
  getAllCarts,
  createCart,
  deleteAllCarts,
  getCartById,
  deleteOneCart,
};
