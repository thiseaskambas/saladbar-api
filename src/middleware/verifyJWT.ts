import { verify } from 'jsonwebtoken';
import { Response, Request, NextFunction } from 'express';
import { catchAsync } from '../utils/catchAsync';
import config from '../utils/config';
import User from '../models/userModel';
import { IUser } from '../utils/tsTypes';
import { Error } from 'mongoose';

export const verifyJWT = catchAsync(
  async (req: Request, _res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return next(new Error('unauthorized')); //401

    const token = authHeader.split(' ')[1];
    const decodedToken = await verify(token, config.ACCESS_TOKEN_SECRET);
    if (!(<any>decodedToken)?.id) {
      return next(new Error('invalid token')); //403
    }
    const currentUser: IUser | null = await User.findById(
      (<any>decodedToken).id
    );
    if (!currentUser) {
      return next(
        new Error('User recently changed password! Please log in again.')
      );
    }
    req.user = currentUser;
    next();
  }
);
