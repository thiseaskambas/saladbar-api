import mongoose from 'mongoose';
import { IUser } from './user.types';

export interface IMessage extends IMessageEntry, mongoose.Document {
  createdBy: IUser['_id'];
}

export interface IMessageEntry {
  createdAt: Date;
  title: string;
  text: string;
  importance?: number;
}
