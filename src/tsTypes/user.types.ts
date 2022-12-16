import mongoose from 'mongoose';

export type Role = 'user' | 'admin' | 'dev';

export interface IUser
  extends Omit<INewUserEntry, 'password' | 'passwordConfirm'>,
    mongoose.Document {
  role: Role;
  passwordHash: string;
  active: boolean;
  refreshToken: string;
  passwordChangedAt: Date;
  passwordResetToken: string | undefined;
  passwordResetExpires: Date | undefined;
  createPasswordResetToken(): string;
}

export interface INewUserEntry {
  username: string;
  email: string;
  password: string;
  fullName: string;
  passwordConfirm: string;
}

export interface IUpdateUserEntry {
  username?: string;
  email?: string;
  fullName?: string;
  password?: string;
  role?: Role;
  passwordConfirm?: string;
}
