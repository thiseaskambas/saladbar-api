import { Schema, model } from 'mongoose';
import { IMessage } from '../tsTypes/message.types';

const messageSchema = new Schema<IMessage>({
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'messages must be created by a User'],
  },
  text: {
    type: String,
    required: [true, 'Messages must contain a text'],
  },
  title: {
    type: String,
    required: [true, 'Messages must have a title'],
  },
  createdAt: {
    type: Date,
    default: new Date(),
    required: [true, 'a message must have a creation date'],
  },
  importance: {
    type: Number,
    min: [1, 'Minimum value is 1'],
    max: [3, 'Maximum value is 3'],
    default: 1,
  },
});

const Message = model<IMessage>('Message', messageSchema);

export default Message;
