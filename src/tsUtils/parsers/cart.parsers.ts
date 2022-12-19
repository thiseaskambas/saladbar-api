import { isValidCartItemEntry } from '../typeguards';
import { ICartItemTobeSaved } from '../../tsTypes';
import { AppError } from '../../utils/appError';
import { ErrorStatusCode } from '../../tsTypes/error.types';

export const parseCartItemEntry = (item: unknown): ICartItemTobeSaved => {
  if (!isValidCartItemEntry(item)) {
    throw new AppError({
      message: 'Cart item not valid',
      statusCode: ErrorStatusCode.BAD_REQUEST,
    });
  }
  return {
    product: item.product,
    quantity: item.quantity,
    discount: item.discount,
  };
};

export const parseCartItemsArr = (arr: unknown): ICartItemTobeSaved[] => {
  if (!arr || !(arr instanceof Array)) {
    throw new AppError({
      message: 'Cart items are not  inside an array',
      statusCode: ErrorStatusCode.BAD_REQUEST,
    });
  }
  //NOTE: merging items in cart that correspond to same product (better implementation on the FE expected)
  const mergedArr: any[] = arr.reduce((acc: any[], curr: any) => {
    const search = (obj: any) => obj.product === curr.product;
    const existIndex = acc.findIndex(search);
    if (existIndex === -1) {
      acc.push(curr);
    } else {
      const findBiggestDiscount = (accumItem: any, current: any) => {
        let accumItemDiscount = accumItem.discount;
        let currentItemDiscount = current.discount;
        if (!accumItemDiscount) {
          accumItemDiscount = 0;
        }
        if (!currentItemDiscount) {
          currentItemDiscount = 0;
        }
        return accumItemDiscount >= currentItemDiscount
          ? accumItemDiscount
          : currentItemDiscount;
      };
      acc[existIndex] = {
        ...acc[existIndex],
        quantity: curr.quantity + acc[existIndex].quantity,
        discount: findBiggestDiscount(acc[existIndex], curr),
      };
    }
    return acc;
  }, []);

  return mergedArr.map((el) => parseCartItemEntry(el));
};

export const parseDiscount = (disc: unknown): number => {
  if (!disc) {
    return 0;
  } else if (isNaN(Number(disc))) {
    throw new AppError({
      message: 'Discount must be of type number',
      statusCode: ErrorStatusCode.BAD_REQUEST,
    });
  } else if (Number(disc) > 100 || Number(disc) < 0) {
    throw new AppError({
      message: 'Discount must be between 0 and 100 (inclusive)',
      additionalInfo: 'Discount must be between 0 and 100 (inclusive)',
      statusCode: ErrorStatusCode.BAD_REQUEST,
    });
  }
  return Number(disc);
};
