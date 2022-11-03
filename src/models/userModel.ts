import { Schema, model } from 'mongoose';
import validator from 'validator';
import { IUser } from '../utils/tsTypes';

/* const tokenSchema = new Schema({
  _userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'user'
  },
  token: {
    type: String,
    required: true
  },
  expireAt: {
    type: Date,
    default: Date.now,
    index: { expires: 60*60*24 }
  }
}) */

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
      enum: ['user', 'admin'],
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

const User = model('User', userSchema);
export default User;
