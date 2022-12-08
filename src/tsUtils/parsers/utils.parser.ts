import { isString, isDateString, isValidMongoId } from '../typeguards';
import { IUser, NodeEnv } from '../../tsTypes';

export const parseFormStringInput = (
  input: unknown,
  description: string
): string => {
  if (!input || !isString(input)) {
    throw new Error(`Missing or incorect ${description}`);
  }
  return input.trim();
};

export const parseEmailCredentials = (cred: unknown): string => {
  if (!cred || !isString(cred)) {
    throw new Error('incorrect or missing credentials');
  }
  return cred;
};

export const parseUri = (uri: unknown): string => {
  if (!uri || !isString(uri)) {
    throw new Error('incorrect or missing uri');
  }
  return uri;
};

export const parseSecret = (secret: unknown): string => {
  if (!secret || !isString(secret)) {
    throw new Error('incorrect or missing secret');
  }
  if (secret.length < 16) {
    throw new Error('secret must be at least 15 chars long');
  }
  return secret;
};

export const parseName = (name: unknown): string => {
  if (!name || !isString(name)) {
    throw new Error('Name is required and must be a string');
  }
  return name.trim();
};

export const parseNumber = (price: unknown): number => {
  if (!price || isNaN(Number(price))) {
    throw new Error('Number is required and must be of type "number"');
  }
  return Number(price);
};

export const parseNodeEnv = (env: unknown): NodeEnv => {
  if (!env || (env !== 'dev' && env !== 'prod')) {
    throw new Error('NODE_ENV must be "dev" OR "prod');
  }
  return env;
};

export const parseUserId = (id: unknown): IUser['_id'] => {
  if (!id || !isValidMongoId(id)) {
    throw new Error('missing or incorrect user id');
  }
  return id;
};

export const parseQueryDate = (date: unknown): string => {
  if (!isDateString(date)) {
    throw new Error('not a valid date format');
  }
  return date;
};
