import { Request, Response, NextFunction } from 'express';
import Message from '../models/messageModel';
import { toMessageEntry } from '../tsUtils/builders';
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

const createMessage = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const messageObj = toMessageEntry(req.body);
    const newMessage = await Message.create({
      ...messageObj,
      createdBy: req.user,
    });
    res.status(200).json({
      status: 'success',
      data: {
        data: newMessage,
      },
    });
  }
);

export default { getAllMessages, createMessage };
