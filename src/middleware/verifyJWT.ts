import { verify } from 'jwt-promisify';
import { Response, Request, NextFunction } from 'express';
import { catchAsync } from '../utils/catchAsync';
import config from '../utils/config';
import User from '../models/userModel';
import { IUser } from '../tsTypes';
import { AppError } from '../utils/appError';
import { ErrorStatusCode } from '../tsTypes/error.types';

export const verifyJWT = catchAsync(
  async (req: Request, _res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader)
      return next(
        new AppError({
          message: 'Authorization missing',
          statusCode: ErrorStatusCode.UNAUTHORIZED,
        })
      );

    const token = authHeader.split(' ')[1];
    let decodedToken;
    try {
      decodedToken = await verify(token, config.ACCESS_TOKEN_SECRET);
    } catch (err) {
      return next(
        new AppError({
          message: 'Invalid token. Please Log in again.',
          statusCode: ErrorStatusCode.UNAUTHORIZED,
        })
      );
    }

    const currentUser: IUser | null = await User.findById(
      (<any>decodedToken).id
    );
    if (!currentUser) {
      return next(
        new AppError({
          message: 'The user belonging to this token does no longer exist.',
          statusCode: ErrorStatusCode.UNAUTHORIZED,
        })
      );
    }

    if (currentUser.passwordChangedAt > new Date(decodedToken.iat * 1000)) {
      return next(
        new AppError({
          message: 'You have modified your password, please login again.',
          statusCode: ErrorStatusCode.UNAUTHORIZED,
        })
      );
    }

    req.user = {
      username: currentUser.username,
      id: currentUser.id,
      role: currentUser.role,
      email: currentUser.email,
      fullName: currentUser.fullName,
    };
    next();
  }
);
