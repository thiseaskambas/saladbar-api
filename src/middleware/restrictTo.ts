import { Response, Request, NextFunction } from 'express';
import { Role } from '../tsTypes';
import { ErrorStatusCode } from '../tsTypes/error.types';
import { AppError } from '../utils/appError';

export const restrictTo = (...roles: Role[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const currentRole = req.user?.role;
    if (!currentRole || !roles.includes(currentRole)) {
      return next(
        new AppError({
          message: 'You do not have permission to perform this action',
          statusCode: ErrorStatusCode.FORBIDEN,
        })
      );
    }
    next();
  };
};
