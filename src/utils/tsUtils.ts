import {
  ICartItemEntry,
  INewCartEntry,
  INewProductEntry,
  NodeEnv,
} from './tsTypes';

//The isSomething functions are a so-called type guards which have a type predicate as the return type
const isString = (text: unknown): text is string => {
  return typeof text === 'string';
};

export const parseUri = (uri: unknown): string => {
  if (!uri || !isString(uri)) {
    throw new Error('incorrect or missing uri');
  }
  return uri;
};

const parseName = (name: unknown): string => {
  if (!name || !isString(name)) {
    throw new Error('Name is required and must be a string');
  }
  return name;
};

const parsePrice = (price: unknown): number => {
  if (!price || isNaN(Number(price))) {
    throw new Error('Number is required and must be of type "number"');
  }
  return Number(price);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const toNewProductEntry = (object: any): INewProductEntry => {
  const newProductEntry: INewProductEntry = {
    name: parseName(object.name),
    price: parsePrice(object.price),
  };
  return newProductEntry;
};

export const parseNodeEnv = (env: unknown): NodeEnv => {
  if (!env || (env !== 'dev' && env !== 'prod')) {
    throw new Error('NODE_ENV must be "dev" OR "prod');
  }
  return env;
};

const isCartItemEntry = (item: any): item is ICartItemEntry => {
  if (!(item.hasOwnProperty('product') && item.hasOwnProperty('quantity'))) {
    return false;
  }
  return isString(item.product) && !isNaN(Number(item.quantity));
};

const isArrayOfCartItemEntries = (arr: any): arr is ICartItemEntry[] => {
  return arr.every(isCartItemEntry);
};

export const parseCartItems = (arr: unknown): ICartItemEntry[] => {
  if (!arr || !isArrayOfCartItemEntries(arr)) {
    throw new Error('Cart items are not correctly structured');
  }
  return arr;
};

export const toNewCartEntry = (object: any): INewCartEntry => {
  const newCartEntry: INewCartEntry = {
    items: parseCartItems(object.items),
  };
  return newCartEntry;
};
