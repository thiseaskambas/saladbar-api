import mongoose from 'mongoose';

export interface IProduct extends mongoose.Document {
  name: string;
  quantity: number;
  price: number;
}
