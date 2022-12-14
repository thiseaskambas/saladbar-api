import { Response, Request, NextFunction } from 'express';

import { catchAsync } from '../utils/catchAsync';
import config from '../utils/config';
import Cart from '../models/cartModel';
import {
  ICart,
  ICartToBeSaved,
  IPaginationOptions,
  IReqQueryAfterBeforeDate,
} from '../tsTypes';
import {
  toCartToBeSaved,
  toPaginationOptions,
  toReqQueryAfterBefore,
} from '../tsUtils/builders';
import { AppError } from '../utils/appError';
import { ErrorStatusCode } from '../tsTypes/error.types';

//controllers for baseURL
const getAllCarts = catchAsync(async (req: Request, res: Response) => {
  const reqQuery: IReqQueryAfterBeforeDate | null =
    req.query.after && req.query.before
      ? toReqQueryAfterBefore(req.query)
      : null;

  const options = reqQuery
    ? { createdAt: { $gte: reqQuery.after, $lte: reqQuery.before } }
    : {};

  const pageOptions: IPaginationOptions = toPaginationOptions(req.query);

  //TODO: maybe move populating to mongoose MOdel
  const allCarts = await Cart.find(options)
    .skip(pageOptions.page * pageOptions.limit)
    .limit(pageOptions.limit)
    .populate({ path: 'createdBy', select: 'username fullname role _id' })
    .sort({ createdAt: -1 });
  const totalCarts = await Cart.countDocuments(options);

  res.status(200).json({
    status: 'success',
    data: {
      data: allCarts,
      count: totalCarts,
    },
  });
});

const createCart = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const cart: ICartToBeSaved = toCartToBeSaved(req.body, req.user);
    const savedCart: ICart = await Cart.create(cart);
    if (!savedCart) {
      return next(
        new AppError({
          message: 'Card could not be created',
          statusCode: ErrorStatusCode.INTERNAL_SERVER_ERROR,
        })
      );
    }

    await savedCart.populate({
      path: 'createdBy',
      select: 'username fullname role _id',
    });

    res.status(201).json({
      status: 'success',
      data: {
        data: savedCart,
      },
    });
  }
);

//NOTE: only in dev environment for dev db
const deleteAllCarts = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.body.deleteAll === 'true' && config.NODE_ENV === 'dev') {
      const { acknowledged } = await Cart.deleteMany({});
      if (!acknowledged) {
        return next(
          new AppError({
            message: 'Could not delete',
            statusCode: ErrorStatusCode.INTERNAL_SERVER_ERROR,
          })
        );
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
      return next(
        new AppError({
          message: 'Cart not found',
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

const deactivateOneCart = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const deactivated = Cart.findByIdAndUpdate(
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

const deleteOneCart = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const deleted = await Cart.findOneAndDelete({
      _id: req.params.id /* active: false */,
    });
    if (!deleted) {
      return next(
        new AppError({
          message:
            'No delete: make sure ID is correct and that the cart was deactivated',
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

//TODO: refactor based on front end implementation
const updateOneCart = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const cartToUpdate = await Cart.findById(req.params.id);
    if (!cartToUpdate) {
      return next(
        new AppError({
          message: 'Cart not found',
          statusCode: ErrorStatusCode.NOT_FOUND,
        })
      );
    }
    cartToUpdate.items = req.body.items;
    cartToUpdate.lastEdited = { editDate: new Date(), editedBy: req.user?.id };
    const updated = await cartToUpdate.save();
    if (!updated) {
      return next(
        new AppError({
          message: 'Cart not updated',
          statusCode: ErrorStatusCode.INTERNAL_SERVER_ERROR,
        })
      );
    }
    await updated.populate({
      path: 'createdBy',
      select: 'username fullname role _id',
    });
    await updated.populate({ path: 'items.product', select: 'name' });

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
  deactivateOneCart,
};
