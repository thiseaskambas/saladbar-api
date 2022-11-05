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

export interface IUpdateProductEntry {
  name?: string;
  price?: number;
  productCourseType?: ProductCourseType;
  active?: boolean;
}

export interface ICartItem extends mongoose.Document {
  product: IProduct['_id'];
  quantity: number;
  itemPrice: number;
  itemPriceBeforeDiscount: number;
  totalPriceBeforeDiscount: number;
  totalPrice: number;
  discount: number;
}

export interface ILastEdited {
  editedBy: IUser['_id'];
  editDate: Date;
}

export interface ICart extends mongoose.Document {
  createdBy: IUser['_id'];
  createdAt: Date;
  lastEdited?: ILastEdited;
  items: ICartItem[];
  discount: number;
  totalPriceBeforeDiscount: number;
  totalPrice: number;
}

export interface INewCartEntry {
  items: ICartItemEntry[];
  discount?: number;
  createdBy: IUser['_id'];
}

export interface ICartItemEntry {
  product: IProduct['_id'];
  quantity: number;
  discount?: number;
}

export interface ILoginCredentials {
  password: string;
  email: string;
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

export interface IReqQueryAfterBeforeDate {
  after: string;
  before: string;
}

export type Role = 'user' | 'admin' | 'dev';

export interface IUser extends mongoose.Document {
  username: string;
  email: string;
  role: Role;
  passwordHash: string;
  active: boolean;
  fullName: string;
  refreshToken: string;
  passwordChangedAt: Date;
  passwordResetToken: string | undefined;
  passwordResetExpires: Date | undefined;
  createPasswordResetToken(): string;
}

export interface INewUserEntry {
  username: string;
  email: string;
  password: string;
  fullName: string;
  passwordConfirm: string;
}
