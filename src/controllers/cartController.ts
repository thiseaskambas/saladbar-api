import { Response, Request, NextFunction } from 'express';

import { catchAsync } from '../utils/catchAsync';
import config from '../utils/config';
import Cart from '../models/cartModel';
import { ICart, INewCartEntry, IReqQueryAfterBeforeDate } from '../tsTypes';
import { toNewCartEntry, toReqQueryAfterBefore } from '../tsUtils/builders';

//controllers for baseURL
const getAllCarts = catchAsync(async (req: Request, res: Response) => {
  const reqQuery: IReqQueryAfterBeforeDate = toReqQueryAfterBefore(req.query);
  const options = reqQuery
    ? { createdAt: { $gte: reqQuery.after, $lte: reqQuery.before } }
    : {};

  const allCarts = await Cart.find(options).sort({ createdAt: 1 });

  res.status(200).json({
    status: 'success',
    data: {
      data: allCarts,
      count: allCarts.length,
    },
  });
});

const createCart = catchAsync(async (req: Request, res: Response) => {
  const cart: INewCartEntry = toNewCartEntry(req.body, req.user);
  const savedCart: ICart = await Cart.create(cart);

  res.status(201).json({
    status: 'success',
    data: {
      data: savedCart,
    },
  });
});

//NOTE: only in dev environment for dev db
const deleteAllCarts = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.body.deleteAll === 'true' && config.NODE_ENV === 'dev') {
      const { acknowledged } = await Cart.deleteMany({});
      if (!acknowledged) {
        return next(new Error('Could NOT delete'));
      }
      res.status(204).json({
        status: 'success',
        data: null,
      });
    }
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

//TODO: refactor based on front end implementation
const updateOneCart = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const cartToUpdate = await Cart.findById(req.params.id);
    if (!cartToUpdate) {
      return next(new Error('No cart found with that ID')); //404
    }
    cartToUpdate.items = req.body.items;
    cartToUpdate.lastEdited = { editDate: new Date(), editedBy: req.user?.id };
    const updated = await cartToUpdate.save();
    res.status(200).json({
      status: 'success',
      data: {
        data: updated,
      },
    });
  }
);

export default {
  getAllCarts,
  createCart,
  deleteAllCarts,
  getCartById,
  deleteOneCart,
  updateOneCart,
};
