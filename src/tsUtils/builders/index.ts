import {
  parseCartItemsArr,
  parseUserId,
  parseDiscount,
  parseName,
  parseNumber,
  parseProductCourseType,
  parseFormStringInput,
  parseQueryDate,
  parseUserRole,
  parseEmail,
  parsePassword,
} from '../parsers';

import {
  ICartToBeSaved,
  INewProductEntry,
  INewUserEntry,
  IReqQueryAfterBeforeDate,
  ILoginCredentials,
  IPaginationOptions,
  IUpdateUserEntry,
} from '../../tsTypes';

export const toCartToBeSaved = (object: any, user: any): ICartToBeSaved => {
  const cartToBeSaved: ICartToBeSaved = {
    items: parseCartItemsArr(object.items),
    createdBy: parseUserId(user.id),
    discount: parseDiscount(object.discount),
    createdAt: new Date(),
  };
  return cartToBeSaved;
};

export const toNewProductEntry = (fields: any, file: any): INewProductEntry => {
  const newProductEntry: INewProductEntry = {
    name: parseName(fields.name),
    price: parseNumber(fields.price),
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
    email: parseEmail(obj.email),
    fullName: parseFormStringInput(obj.fullName, 'full name'),
    password: parsePassword(obj.password),
    passwordConfirm: parsePassword(obj.passwordConfirm),
  };
  return newUserEntry;
};

export const toUpdateUserEntry = (obj: any): IUpdateUserEntry => {
  const updateUserEntry = {} as IUpdateUserEntry;

  if (obj.role) updateUserEntry.role = parseUserRole(obj.role);
  if (obj.fullName)
    updateUserEntry.fullName = parseFormStringInput(obj.fullName, 'full name');
  if (obj.username)
    updateUserEntry.username = parseFormStringInput(obj.username, 'username');
  return updateUserEntry;
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
    email: parseEmail(obj.email),
  };
  return loginCredentials;
};
export const toPaginationOptions = (obj: any): IPaginationOptions => {
  const pageOptions = {
    page: parseInt(obj.page, 10) || 0,
    limit: parseInt(obj.limit, 10) || 10,
  };
  return pageOptions;
};
