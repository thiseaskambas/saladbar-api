import { isProductCourseType } from '../typeguards';
import { ProductCourseType } from '../../tsTypes';

export const parseProductCourseType = (courseType: any): ProductCourseType => {
  if (!courseType || !isProductCourseType(courseType)) {
    throw new Error('missing or incorrect product course type');
  }
  return courseType;
};
