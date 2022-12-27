import crypto from 'crypto';
import { Schema, model } from 'mongoose';
import validator from 'validator';
import { IUser } from '../tsTypes';

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: [true, 'users must have a username'],
      unique: true,
    },
    email: {
      type: String,
      required: [true, 'users must have an email'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'email must be of valid format'],
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'dev'],
      default: 'user',
    },
    passwordHash: String,
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
    fullName: String,
    refreshToken: String,
    passwordChangedAt: Date,
    passwordResetToken: String || undefined,
    passwordResetExpires: Date || undefined,
  },
  {
    toJSON: {
      virtuals: true,
      transform: function (_doc, ret) {
        delete ret.__v;
        delete ret._id;
        delete ret.passwordHash;
      },
    },
  }
);
//set the date 1sec back so that the password appears older than the new token released when modifying it
userSchema.pre('save', function (next) {
  if (!this.isModified('passwordHash') || this.isNew) return next();
  this.passwordChangedAt = new Date(Date.now() - 1000);
  next();
});

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);

  return resetToken;
};

const User = model('User', userSchema);
export default User;
