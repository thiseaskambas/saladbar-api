import validator from 'validator';
import {
  isString,
  isDateString,
  isValidMongoId,
  isValidRole,
} from '../typeguards';
import { IUser, NodeEnv } from '../../tsTypes';
import { ErrorStatusCode } from '../../tsTypes/error.types';
import { AppError } from '../../utils/appError';
import { IMessage } from '../../tsTypes/message.types';

export const parseFormStringInput = (
  input: unknown,
  description: string
): string => {
  if (!input || !isString(input)) {
    throw new AppError({
      message: `Missing ${description}, or not a string`,
      statusCode: ErrorStatusCode.BAD_REQUEST,
    });
  }
  return input.trim();
};

export const parseUserName = (input: unknown): string => {
  if (!input || !isString(input)) {
    throw new AppError({
      message: `Missing username, or not a string`,
      statusCode: ErrorStatusCode.BAD_REQUEST,
    });
  }
  if (input.trim().includes(' ')) {
    throw new AppError({
      message: `Usernames cannot contain spaces`,
      statusCode: ErrorStatusCode.BAD_REQUEST,
    });
  }
  if (input.trim().length > 15 || input.trim().length < 5) {
    throw new AppError({
      message: `Usernames must have between 5 and 10 characters`,
      statusCode: ErrorStatusCode.BAD_REQUEST,
    });
  }
  return input.trim();
};

export const parsePassword = (input: unknown): string => {
  if (
    !input ||
    !isString(input) ||
    validator.isStrongPassword(input, { minLength: 5, minNumbers: 1 })
  ) {
    throw new AppError({
      message: `Password not strong enough, must have at least 1 number and be 5 characters long`,
      statusCode: ErrorStatusCode.BAD_REQUEST,
    });
  }
  return input;
};

export const parseEmail = (input: unknown): string => {
  if (!input || !isString(input) || !validator.isEmail(input)) {
    throw new AppError({
      message: `Missing or invalid email`,
      statusCode: ErrorStatusCode.BAD_REQUEST,
    });
  }
  return input.trim();
};

export const parseEmailCredentials = (cred: unknown): string => {
  if (!cred || !isString(cred)) {
    throw new AppError({
      message: `Missing or incorect credentials`,
      statusCode: ErrorStatusCode.BAD_REQUEST,
    });
  }
  return cred;
};

export const parseUri = (uri: unknown): string => {
  if (!uri || !isString(uri)) {
    throw new AppError({
      message: `Missing or incorect URI`,
      statusCode: ErrorStatusCode.BAD_REQUEST,
    });
  }
  return uri;
};

export const parseSecret = (secret: unknown): string => {
  if (!secret || !isString(secret)) {
    throw new AppError({
      message: `Missing or incorect secret`,
      statusCode: ErrorStatusCode.BAD_REQUEST,
    });
  }
  if (secret.length < 16) {
    throw new AppError({
      message: 'secret must be at least 15 chars long',
      statusCode: ErrorStatusCode.BAD_REQUEST,
    });
  }
  return secret;
};

export const parseName = (name: unknown): string => {
  if (!name || !isString(name)) {
    throw new AppError({
      message: 'Name is required and must be a string',
      statusCode: ErrorStatusCode.BAD_REQUEST,
    });
  }
  return name.trim();
};

export const parseDuration = (name: unknown): string => {
  if (!name || !isString(name)) {
    throw new AppError({
      message: 'Duration is required and must be a string',
      statusCode: ErrorStatusCode.BAD_REQUEST,
    });
  }
  return name.trim();
};

export const parseNumber = (price: unknown): number => {
  if (!price || isNaN(Number(price))) {
    throw new AppError({
      message: 'Price is required and must be of type "number"',
      statusCode: ErrorStatusCode.BAD_REQUEST,
    });
  }
  return Number(price);
};
export const parseImportance = (
  importance: unknown
): IMessage['importance'] => {
  if (!importance || isNaN(Number(importance))) {
    return 1;
  }
  if (
    Math.round(Number(importance)) < 1 ||
    Math.round(Number(importance)) > 3
  ) {
    throw new AppError({
      message: 'Importance can be 1,2 or 3',
      statusCode: ErrorStatusCode.BAD_REQUEST,
    });
  }
  return Number(importance);
};

export const parseNodeEnv = (env: unknown): NodeEnv => {
  if (!env || (env !== 'dev' && env !== 'prod')) {
    throw new AppError({
      message: 'NODE_ENV must be "dev" OR "prod',
      statusCode: ErrorStatusCode.BAD_REQUEST,
    });
  }
  return env;
};

export const parseUserId = (id: unknown): IUser['_id'] => {
  if (!id || !isValidMongoId(id)) {
    throw new AppError({
      message: 'missing or incorrect user id',
      statusCode: ErrorStatusCode.BAD_REQUEST,
    });
  }
  return id;
};

export const parseQueryDate = (date: unknown): string => {
  if (!isDateString(date)) {
    throw new AppError({
      message: 'not a valid date format',
      statusCode: ErrorStatusCode.BAD_REQUEST,
    });
  }
  return date;
};

export const parseUserRole = (role: unknown): IUser['role'] => {
  if (!isValidRole(role)) {
    throw new AppError({
      message: 'not a valid user role',
      statusCode: ErrorStatusCode.BAD_REQUEST,
    });
  }
  return role;
};
