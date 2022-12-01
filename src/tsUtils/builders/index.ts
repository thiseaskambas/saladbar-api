import {
  parseCartItemsArr,
  parseUserId,
  parseDiscount,
  parseName,
  parsePrice,
  parseProductCourseType,
  parseFormStringInput,
  parseQueryDate,
} from '../parsers';

import {
  INewCartEntry,
  INewProductEntry,
  INewUserEntry,
  IReqQueryAfterBeforeDate,
  ILoginCredentials,
} from '../../tsTypes';

export const toNewCartEntry = (object: any, user: any): INewCartEntry => {
  const newCartEntry: INewCartEntry = {
    items: parseCartItemsArr(object.items),
    createdBy: parseUserId(user.id),
    discount: parseDiscount(object.discount),
  };
  return newCartEntry;
};

export const toNewProductEntry = (fields: any, file: any): INewProductEntry => {
  const newProductEntry: INewProductEntry = {
    name: parseName(fields.name),
    price: parsePrice(fields.price),
    productCourseType: parseProductCourseType(fields.productCourseType),
    image: {
      url: file.url,
      secure_url: file.secure_url,
      filename: file['original_filename'],
      public_id: file.public_id,
    },
  };
  return newProductEntry;
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

export const toReqQueryAfterBefore = (obj: any): IReqQueryAfterBeforeDate => {
  const reqQuery: IReqQueryAfterBeforeDate = {
    after: parseQueryDate(obj.after),
    before: parseQueryDate(obj.before),
  };
  return reqQuery;
};

export const toLoginCredentials = (obj: any): ILoginCredentials => {
  const loginCredentials: ILoginCredentials = {
    password: parseFormStringInput(obj.password, 'password'),
    email: parseFormStringInput(obj.email, 'email'),
  };
  return loginCredentials;
};
