import { Response, Request, NextFunction } from 'express';
import { IUser } from '../tsTypes';
import User from '../models/userModel';
import { catchAsync } from '../utils/catchAsync';

const findAllUsers = catchAsync(async (_req: Request, res: Response) => {
  const foundUsers: IUser[] = await User.find().select('-refreshToken');
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
      return next(new Error('No user found with that ID')); //404
    }
    res.status(200).json({
      status: 'success',
      data: {
        data: found,
      },
    });
  }
);
const findMe = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const found: IUser | null = await User.findById(req.user?.id);
    if (!found) {
      return next(new Error('No user found with that ID')); //404
    }
    res.status(200).json({
      status: 'success',
      data: {
        data: found,
      },
    });
  }
);

const editUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userToUpdate = await User.findById(req.params.id).select(
      '-passwordHash -refreshToken'
    );
    if (!userToUpdate) {
      return next(new Error('No User found with that ID')); //404
    }
    userToUpdate.role = req.body.role;
    userToUpdate.fullName = req.body.fullName;
    userToUpdate.username = req.body.username;
    const updated = await userToUpdate.save();
    console.log({ updated });
    res.status(200).json({
      status: 'success',
      data: {
        data: updated,
      },
    });
  }
);

export default { findAllUsers, findOneUser, findMe, editUser };
