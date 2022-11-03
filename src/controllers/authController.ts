import { Response, Request, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import { sign } from 'jsonwebtoken';

import { catchAsync } from '../utils/catchAsync';
import User from '../models/userModel';
import { ILoginCredentials, INewUserEntry, IUser } from '../utils/tsTypes';
import { toLoginCredentials, toNewUserEntry } from '../utils/tsUtils';
import config from '../utils/config';

const logIn = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    //TODO: type req.body
    const { email, password }: ILoginCredentials = toLoginCredentials(req.body);
    if (!email || !password) {
      return next(new Error('Please provide email and password!'));
    }
    const found: IUser | null = await User.findOne({ email });

    const passwordCorrect =
      found === null
        ? false
        : await bcrypt.compare(password, found.passwordHash);

    if (!found || !passwordCorrect) {
      return new Error('Wrong email or username');
    }
    const userForToken = { username: found.username, id: found._id };
    const accessToken = sign(userForToken, config.ACCESS_TOKEN_SECRET, {
      expiresIn: '15m',
    });
    const refreshToken = sign(userForToken, config.REFRESH_TOKEN_SECRET, {
      expiresIn: '1d',
    });

    found.refreshToken = refreshToken;
    await found.save();
    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      //NOTE: secure: true - only serves on https for Production
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

const signUp = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const input: INewUserEntry = toNewUserEntry(req.body);
    const found = await User.findOne({
      $or: [{ username: input.username }, { email: input.email }],
    });
    if (found) {
      return next(new Error('Username or email already exists'));
    }
    const hashedPassword = await bcrypt.hash(input.password, 10);

    const newUser = await User.create({
      ...input,
      passwordHash: hashedPassword,
    });

    res.status(201).json({
      status: 'success',
      data: {
        data: newUser,
      },
    });
  }
);

export default { logIn, signUp };
