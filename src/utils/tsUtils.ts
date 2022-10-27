import { INewProductEntry } from './tsTypes';

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
  const newProduct: INewProductEntry = {
    name: parseName(object.name),
    price: parsePrice(object.price),
  };
  return newProduct;
};
