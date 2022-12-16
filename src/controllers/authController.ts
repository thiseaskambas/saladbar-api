import { Response, Request, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import { sign } from 'jsonwebtoken';
import crypto from 'crypto';
import { catchAsync } from '../utils/catchAsync';
import User from '../models/userModel';
import { ILoginCredentials, INewUserEntry, IUser } from '../tsTypes/';
import { toLoginCredentials, toNewUserEntry } from '../tsUtils/builders';
import config from '../utils/config';
import { sendPwdResetEmail } from '../utils/emailSender';

const logIn = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
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
      return next(new Error('Wrong email or username'));
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
      secure: config.NODE_ENV === 'prod',
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

const signUp = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const input: INewUserEntry = toNewUserEntry(req.body);
    if (input.password !== input.passwordConfirm) {
      return next(new Error('Password confirmation failled'));
    }
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

const forgotPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return next(new Error('There is no user with email address.')); //404
    }
    const resetToken = user.createPasswordResetToken();
    await user.save();
    try {
      const resetURL = `${req.protocol}://${req.get(
        'host'
      )}/api/v1/auth/reset-password/${user.id}/${resetToken}`;
      await sendPwdResetEmail(user, resetURL);
      res.status(200).json({
        status: 'success',
        message: 'Token sent to email!',
      });
    } catch (err) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save();
      return next(new Error('Error while sending email'));
    }
  }
);

const resetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.resetToken)
      .digest('hex');

    const user: IUser | null = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: new Date(Date.now()) },
      id: req.params.id,
    });

    if (!user) {
      return next(new Error('Token is invalid or has expired')); //400
    }
    const { password, passwordConfirm } = req.body;
    if (password !== passwordConfirm) {
      return new Error('Password confirmation failled');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    user.passwordHash = hashedPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    res.status(201).json({
      status: 'success',
      data: {
        data: user,
      },
    });
  }
);

const updatePassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    console.log('updating pwd', req.body.oldPassword);
    const found = await User.findById(req.user.id).select('+passwordHash');
    if (!found) {
      return next(new Error('User not found'));
    }
    const oldPasswordCorrect = await bcrypt.compare(
      req.body.oldPassword,
      found.passwordHash
    );
    if (req.body.password !== req.body.passwordConfirm || !oldPasswordCorrect) {
      return next(new Error('Password confirmation failled'));
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    found.passwordHash = hashedPassword;

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
      secure: config.NODE_ENV === 'prod',
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

export default { logIn, signUp, forgotPassword, resetPassword, updatePassword };
