import { Response, Request, NextFunction } from 'express';
import { IUser } from '../utils/tsTypes';
import User from '../models/userModel';
import { catchAsync } from '../utils/catchAsync';

const findAllUsers = catchAsync(async (_req: Request, res: Response) => {
  const foundUsers: IUser[] = await User.find({});
  res.status(200).json({
    status: 'success',
    data: {
      data: foundUsers,
    },
  });
});

const findOneUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const found: IUser | null = await User.findById(req.params.id);
    if (!found) {
      return next(new Error('No document found with that ID')); //404
    }
    res.status(200).json({
      status: 'success',
      data: {
        data: found,
      },
    });
  }
);

export default { findAllUsers, findOneUser };
