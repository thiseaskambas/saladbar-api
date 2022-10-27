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
  itemPrice: number;
  totalPrice: number;
}

export interface ICart extends mongoose.Document {
  items: ICartItem[];
  createdAt: Date;
  totalPrice: number;
}

export interface INewCartEntry {
  items: ICartItemEntry[];
}

export interface ICartItemEntry {
  product: IProduct['_id'];
  quantity: number;
}

export type NodeEnv = 'dev' | 'prod';
