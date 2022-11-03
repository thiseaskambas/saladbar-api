import {
  ICartItemEntry,
  ILoginCredentials,
  INewCartEntry,
  INewProductEntry,
  INewUserEntry,
  IReqQueryAfterBeforeDate,
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

export const parseSecret = (secret: unknown): string => {
  if (!secret || !isString(secret)) {
    throw new Error('incorrect or missing secret');
  }
  if (secret.length < 16) {
    throw new Error('secret must be at least 15 chars long');
  }
  return secret;
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

export const toLoginCredentials = (obj: any): ILoginCredentials => {
  const loginCredentials: ILoginCredentials = {
    password: parseFormStringInput(obj.password, 'password'),
    email: parseFormStringInput(obj.email, 'email'),
  };
  return loginCredentials;
};

export const parseNodeEnv = (env: unknown): NodeEnv => {
  if (!env || (env !== 'dev' && env !== 'prod')) {
    throw new Error('NODE_ENV must be "dev" OR "prod');
  }
  return env;
};

const isValidCartItemEntry = (item: any): item is ICartItemEntry => {
  if (!(item.hasOwnProperty('product') && item.hasOwnProperty('quantity'))) {
    return false;
  }
  if (
    !isString(item.product) ||
    isNaN(Number(item.quantity)) ||
    item.quantity < 1 ||
    item.quantity > 999999
  ) {
    return false;
  }
  return true;
};

const parseCartItemEntry = (item: unknown): ICartItemEntry => {
  if (!isValidCartItemEntry(item)) {
    throw new Error('Cart item not valid');
  }
  return { product: item.product, quantity: item.quantity };
};

const parseCartItemsArr = (arr: unknown): ICartItemEntry[] => {
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

const isDateString = (date: unknown): date is string => {
  if (isString(date)) {
    return new Date(date) instanceof Date && !isNaN(Date.parse(date));
  }
  return false;
};

const parseQueryDate = (date: unknown): string => {
  if (!isDateString(date)) {
    throw new Error('not a valid date format');
  }
  return date;
};

export const toReqQueryAfterBefore = (obj: any): IReqQueryAfterBeforeDate => {
  const reqQuery: IReqQueryAfterBeforeDate = {
    after: parseQueryDate(obj.after),
    before: parseQueryDate(obj.before),
  };
  return reqQuery;
};

const parseFormStringInput = (input: unknown, description: string): string => {
  if (!input || !isString(input)) {
    throw new Error(`Missing or incorect ${description}`);
  }
  return input;
};

export const toNewUserEntry = (obj: any): INewUserEntry => {
  const newUserEntry = {
    username: parseFormStringInput(obj.username, 'username'),
    email: parseFormStringInput(obj.email, 'email'),
    password: parseFormStringInput(obj.password, 'password'),
    fullName: parseFormStringInput(obj.fullName, 'full name'),
    passwordConfirm: parseFormStringInput(
      obj.passwordConfirm,
      'confirmation password'
    ),
  };
  return newUserEntry;
};
