import { Response, Request } from 'express';

import Cart from '../models/cartModel';
import { ICart, INewCartEntry } from '../utils/tsTypes';
import { catchAsync } from '../utils/catchAsync';
import config from '../utils/config';
import { toNewCartEntry } from '../utils/tsUtils';

const getAllCarts = catchAsync(async (_req: Request, res: Response) => {
  const allCarts = await Cart.find({});
  res.send(allCarts);
});

const createCart = catchAsync(async (req: Request, res: Response) => {
  const cart: INewCartEntry = toNewCartEntry(req.body);
  const savedCart: ICart = await Cart.create(cart);
  res.send(savedCart);
});

const deleteAllCarts = catchAsync(async (req: Request, res: Response) => {
  if (req.body.deleteAll === 'true' && config.NODE_ENV === 'dev') {
    await Cart.deleteMany({});
    return res.send('deleted all carts');
  }
  return res.send('no delete');
});

export default { getAllCarts, createCart, deleteAllCarts };
