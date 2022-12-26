import { Request, Response, NextFunction } from 'express';
import Message from '../models/messageModel';
import { ErrorStatusCode } from '../tsTypes/error.types';
import { IMessage } from '../tsTypes/message.types';
import { toMessageEntry } from '../tsUtils/builders';
import { AppError } from '../utils/appError';
import { catchAsync } from '../utils/catchAsync';

const getAllMessages = catchAsync(
  async (_req: Request, res: Response, _next: NextFunction) => {
    const allMessages = await Message.find({});
    res.status(200).json({
      status: 'success',
      data: {
        data: allMessages,
      },
    });
  }
);
const getLatestMessage = catchAsync(
  async (_req: Request, res: Response, next: NextFunction) => {
    const lastMessage: IMessage | null = await Message.findOne(
      {},
      {},
      { sort: { createdAt: -1 } }
    ).populate({ path: 'createdBy', select: 'username' });
    if (!lastMessage) {
      return next(
        new AppError({
          message: 'No message found',
          statusCode: ErrorStatusCode.NOT_FOUND,
        })
      );
    }
    res.status(200).json({
      status: 'success',
      data: lastMessage,
    });
  }
);
const getMessageById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const found: IMessage | null = await Message.findById(req.params.id);
    if (!found) {
      return next(
        new AppError({
          message: 'No message found',
          statusCode: ErrorStatusCode.NOT_FOUND,
        })
      );
    }
    res.status(200).json({
      status: 'success',
      data: {
        data: found,
      },
    });
  }
);

const createMessage = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const messageObj = toMessageEntry(req.body);
    const newMessage = await Message.create({
      ...messageObj,
      createdBy: req.user.id,
    });
    await newMessage.populate({ path: 'createdBy', select: 'username' });
    res.status(200).json({
      status: 'success',
      data: {
        data: newMessage,
      },
    });
  }
);
const deleteMessage = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const deleted: IMessage | null = await Message.findOneAndRemove({
      _id: req.params.id,
    });
    if (!deleted) {
      return next(
        new AppError({
          message: 'No message deleted',
          statusCode: ErrorStatusCode.NOT_FOUND,
        })
      );
    }
    res.status(200).json({
      status: 'success',
      data: {
        data: deleted,
      },
    });
  }
);

export default {
  getAllMessages,
  createMessage,
  getLatestMessage,
  getMessageById,
  deleteMessage,
};
