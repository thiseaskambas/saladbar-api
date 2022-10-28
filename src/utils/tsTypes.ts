import mongoose from 'mongoose';

export interface IProduct extends mongoose.Document {
  name: string;
  price: number;
  productCourseType: ProductCourseType;
  active: boolean;
}

export interface INewProductEntry {
  name: string;
  price: number;
  productCourseType: ProductCourseType;
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

export enum ProductCourseType {
  Starter = 'starter',
  Main = 'main',
  Desert = 'desert',
  Drink = 'drink',
  Side = 'side',
  Other = 'other',
}
