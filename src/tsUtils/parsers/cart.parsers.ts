import { isValidCartItemEntry } from '../typeguards';
import { ICartItemEntry } from '../../tsTypes';

export const parseCartItemEntry = (item: unknown): ICartItemEntry => {
  if (!isValidCartItemEntry(item)) {
    console.log(item);
    throw new Error('Cart item not valid');
  }
  return {
    product: item.product,
    quantity: item.quantity,
    discount: item.discount,
  };
};

export const parseCartItemsArr = (arr: unknown): ICartItemEntry[] => {
  if (!arr || !(arr instanceof Array)) {
    throw new Error('Cart items are not  inside an array');
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
  if (!disc || isNaN(Number(disc))) {
    throw new Error('Discount must be of type number');
  } else if (disc > 100 || disc < 0) {
    throw new Error('Discount must be between 0 and 100 (inclusive)');
  }
  return Number(disc);
};
