import mongoose from 'mongoose';
import { IUser } from './user.types';
import { IProduct } from './product.types';

export interface ILastEdited {
  editedBy: IUser['_id'];
  editDate: Date;
}

export interface ICart
  extends Omit<ICartToBeSaved, 'items'>,
    mongoose.Document {
  items: ICartItem[];
  createdAt: Date;
  lastEdited?: ILastEdited;
  totalPriceBeforeDiscount: number;
  totalPrice: number;
  active: boolean;
}

export interface ICartItem extends ICartItemTobeSaved, mongoose.Document {
  itemPrice: number;
  itemPriceBeforeDiscount: number;
  totalPriceBeforeDiscount: number;
  totalPrice: number;
}

export interface ICartToBeSaved {
  items: ICartItemTobeSaved[];
  discount: number;
  createdBy: IUser['_id'];
  createdAt?: Date;
}

export interface ICartItemTobeSaved {
  product: IProduct['_id'];
  quantity: number;
  discount: number;
}
