import mongoose from 'mongoose';
import { IUser } from './user.types';
import { IProduct } from './product.types';

export interface ILastEdited {
  editedBy: IUser['_id'];
  editDate: Date;
}

export interface ICart extends Omit<INewCartEntry, 'items'>, mongoose.Document {
  items: ICartItem[];
  createdAt: Date;
  lastEdited?: ILastEdited;
  totalPriceBeforeDiscount: number;
  totalPrice: number;
}

export interface INewCartEntry {
  items: ICartItemEntry[];
  discount: number;
  createdBy: IUser['_id'];
}

export interface ICartItem extends ICartItemEntry, mongoose.Document {
  itemPrice: number;
  itemPriceBeforeDiscount: number;
  totalPriceBeforeDiscount: number;
  totalPrice: number;
}
export interface ICartItemEntry {
  product: IProduct['_id'];
  quantity: number;
  discount: number;
}
