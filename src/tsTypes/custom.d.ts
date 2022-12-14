import express from 'express';

import { IUser } from './utils.types';

//add user property on Express.Request:
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}
