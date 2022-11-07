import mongoose from 'mongoose';

export enum ProductCourseType {
  Starter = 'starter',
  Main = 'main',
  Desert = 'desert',
  Drink = 'drink',
  Side = 'side',
  Other = 'other',
}

export interface INewProductEntry {
  name: string;
  price: number;
  productCourseType: ProductCourseType;
}
export interface IProduct extends INewProductEntry, mongoose.Document {
  active: boolean;
}

export interface IUpdateProductEntry {
  name?: string;
  price?: number;
  productCourseType?: ProductCourseType;
  active?: boolean;
}
