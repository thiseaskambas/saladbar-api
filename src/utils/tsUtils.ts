import {
  ICartItemEntry,
  INewCartEntry,
  INewProductEntry,
  NodeEnv,
  ProductCourseType,
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

const isProductCourseType = (param: any): param is ProductCourseType => {
  return Object.values(ProductCourseType).includes(param);
};

const parseProductCourseType = (courseType: any): ProductCourseType => {
  if (!courseType || !isProductCourseType(courseType)) {
    throw new Error('missing or incorrect product course type');
  }
  return courseType;
};

export const toNewProductEntry = (object: any): INewProductEntry => {
  const newProductEntry: INewProductEntry = {
    name: parseName(object.name),
    price: parsePrice(object.price),
    productCourseType: parseProductCourseType(object.productCourseType),
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
  if (!isString(item.product) || isNaN(Number(item.quantity))) {
    return false;
  }
  return true;
};

const parseCartItemEntry = (item: any): ICartItemEntry => {
  if (!isCartItemEntry(item)) {
    throw new Error('Item malformed');
  }
  return { product: item.product, quantity: item.quantity };
};

export const parseCartItemsArr = (arr: unknown): ICartItemEntry[] => {
  if (!arr || !(arr instanceof Array)) {
    throw new Error('Cart items are not  inside an array');
  }

  return arr.map((el) => parseCartItemEntry(el));
};

export const toNewCartEntry = (object: any): INewCartEntry => {
  const newCartEntry: INewCartEntry = {
    items: parseCartItemsArr(object.items),
  };
  return newCartEntry;
};
