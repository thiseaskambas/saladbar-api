import mongoose from 'mongoose';
import { IUser } from './user.types';

export interface IMessage extends IMessageEntry, mongoose.Document {
  createdBy: IUser['_id'];
  createdAt: Date;
}

export interface IMessageEntry {
  title: string;
  text: string;
  importance?: number;
}
