import { Response, Request, NextFunction } from 'express';
import { Role } from '../utils/tsTypes';

export const restrictTo = (...roles: Role[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const currentRole = req.user?.role;
    if (!currentRole || !roles.includes(currentRole)) {
      return next(
        new Error('You do not have permission to perform this action') //403
      );
    }
    next();
  };
};
