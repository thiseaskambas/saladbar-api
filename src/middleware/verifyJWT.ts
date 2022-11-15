import { verify } from 'jwt-promisify';
import { Response, Request, NextFunction } from 'express';
import { catchAsync } from '../utils/catchAsync';
import config from '../utils/config';
import User from '../models/userModel';
import { IUser } from '../tsTypes';

export const verifyJWT = catchAsync(
  async (req: Request, _res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return next(new Error('unauthorized')); //401

    const token = authHeader.split(' ')[1];
    let decodedToken;
    try {
      decodedToken = await verify(token, config.ACCESS_TOKEN_SECRET);
    } catch (err) {
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
