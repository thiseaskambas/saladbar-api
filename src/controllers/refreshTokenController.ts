import { Response, Request, NextFunction } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { verify } from 'jwt-promisify';
import { sign } from 'jsonwebtoken';
import { IUser } from '../tsTypes';

import config from '../utils/config';
import User from '../models/userModel';
import { ErrorStatusCode } from '../tsTypes/error.types';
import { AppError } from '../utils/appError';

const handleRefreshToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) {
      return next(
        new AppError({
          message: 'No jwt cookie found',
          statusCode: ErrorStatusCode.UNAUTHORIZED,
        })
      );
    }
    const refreshToken = cookies.jwt;
    const found: IUser | null = await User.findOne({ refreshToken });

    if (!found) {
      return next(
        new AppError({
          message: 'User not found with the provided refresh token',
          statusCode: ErrorStatusCode.FORBIDEN,
        })
      );
    }

    const decodedToken = await verify(
      refreshToken,
      config.REFRESH_TOKEN_SECRET
    );

    if (!decodedToken) {
      return next(
        new AppError({
          message: 'Invalid token',
          statusCode: ErrorStatusCode.FORBIDEN,
        })
      );
    }

    const userForToken = { username: found.username, id: found._id };

    const accessToken = sign(userForToken, config.ACCESS_TOKEN_SECRET, {
      expiresIn: '15m',
    });

    res.status(200).json({
      accessToken,
      loggedUser: {
        username: found.username,
        id: found._id,
        role: found.role,
        email: found.email,
        fullName: found.fullName,
      },
    });
  }
);

export default { handleRefreshToken };
