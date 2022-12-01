import { ObjectId } from 'mongoose';
import { ProductCourseType, ICartItemEntry } from '../../tsTypes';

//The isSomething functions are a so-called type guards which have a type predicate as the return type

export const isString = (text: unknown): text is string => {
  return typeof text === 'string';
};

export const isProductCourseType = (param: any): param is ProductCourseType => {
  return Object.values(ProductCourseType).includes(param);
};

export const isValidCartItemEntry = (item: any): item is ICartItemEntry => {
  if (!(item.hasOwnProperty('product') && item.hasOwnProperty('quantity'))) {
    console.log('not valid cart item entry');
    return false;
  }
  if (
    !isString(item.product) ||
    isNaN(Number(item.quantity)) ||
    item.quantity < 1 ||
    item.quantity > 999999 ||
    (item.hasOwnProperty('discount') && isNaN(Number(item.discount)))
  ) {
    return false;
  }
  return true;
};

export const isValidMongoId = (id: unknown): id is ObjectId => {
  return new Object(id).toString() === id;
};

export const isDateString = (date: unknown): date is string => {
  if (isString(date)) {
    return new Date(date) instanceof Date && !isNaN(Date.parse(date));
  }
  return false;
};
