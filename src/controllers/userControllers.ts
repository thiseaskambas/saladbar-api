import { Response, Request, NextFunction } from 'express';

import { IUser } from '../tsTypes';
import User from '../models/userModel';
import { catchAsync } from '../utils/catchAsync';
import { toUpdateUserEntry } from '../tsUtils/builders';
import { AppError } from '../utils/appError';
import { ErrorStatusCode } from '../tsTypes/error.types';

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
      return next(
        new AppError({
          message: 'User not found',
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
const findMe = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const found: IUser | null = await User.findById(req.user?.id);
    if (!found) {
      return next(
        new AppError({
          message: 'User not found',
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

const editUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.body.password || req.body.passwordConfirm) {
      return next(
        new AppError({
          message:
            'This route is not for password updates. Please use /update-password.',
          statusCode: ErrorStatusCode.BAD_REQUEST,
        })
      );
    }

    const newValues = toUpdateUserEntry(req.body);
    const updatedUser = await User.findByIdAndUpdate(req.params.id, newValues, {
      new: true,
    }).select('-passwordHash -refreshToken');
    if (!updatedUser) {
      return next(
        new AppError({
          message: 'Could not update',
          statusCode: ErrorStatusCode.INTERNAL_SERVER_ERROR,
        })
      );
    }
    res.status(200).json({
      status: 'success',
      data: {
        data: updatedUser,
      },
    });
  }
);

export default { findAllUsers, findOneUser, findMe, editUser };
