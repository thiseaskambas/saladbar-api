import mongoose from 'mongoose';

export interface IProduct {
  name: string;
  quantity: number;
  price: number;
  _id: mongoose.Types.ObjectId;
}
