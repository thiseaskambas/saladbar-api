import { Response, Request, NextFunction } from 'express';
import { verify, sign } from 'jsonwebtoken';
import { catchAsync } from '../utils/catchAsync';

import { IUser } from '../utils/tsTypes';

import config from '../utils/config';
import User from '../models/userModel';

const handleRefreshToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) {
      return next(new Error('no jwt cookie found')); //401
    }
    const refreshToken = cookies.jwt;
    const found: IUser | null = await User.findOne({ refreshToken });

    if (!found) {
      return next(new Error('user not found')); // 403
    }
    const userForToken = { username: found.username, id: found._id };
    const decoded = await verify(refreshToken, config.REFRESH_TOKEN_SECRET);
    if (!decoded) {
      return next(new Error('invalid token')); //403
    }
    const accessToken = sign(userForToken, config.ACCESS_TOKEN_SECRET, {
      expiresIn: '15m',
    });

    res.status(200).json({
      accessToken,
      loggedUser: {
        username: found.username,
        name: found.fullName,
        id: found._id,
        role: found.role,
      },
    });
  }
);

export default { handleRefreshToken };
