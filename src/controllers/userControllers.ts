import { Response, Request, NextFunction } from 'express';

import { IUser } from '../tsTypes';
import User from '../models/userModel';
import { catchAsync } from '../utils/catchAsync';
import { toUpdateUserEntry } from '../tsUtils/builders';

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
    if (req.body.password || req.body.passwordConfirm) {
      return next(
        new Error(
          'This route is not for password updates. Please use /update-password.'
        )
      );
    }
    console.log('editing user');
    const newValues = toUpdateUserEntry(req.body);
    const userToUpdate = await User.findByIdAndUpdate(
      req.params.id,
      newValues,
      { new: true }
    ).select('-passwordHash -refreshToken');
    if (!userToUpdate) {
      return next(new Error('Could not update')); //500?
    }
    res.status(200).json({
      status: 'success',
      data: {
        data: userToUpdate,
      },
    });
  }
);

export default { findAllUsers, findOneUser, findMe, editUser };
