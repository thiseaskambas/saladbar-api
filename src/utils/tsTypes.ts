import mongoose from 'mongoose';

export interface IProduct extends mongoose.Document {
  name: string;
  price: number;
}

export interface INewProductEntry {
  name: string;
  price: number;
}

export interface ICartItem extends mongoose.Document {
  product: IProduct['_id'];
  quantity: number;
  totalPrice: number;
}

export interface ICart extends mongoose.Document {
  items: [ICartItem];
  createdAt: Date;
  totalPrice: number;
}
