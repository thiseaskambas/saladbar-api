import { Response, Request, NextFunction } from 'express';

import {
  ErrorStatusCode,
  MongoError,
  MongooseCastError,
  MongooseValidationError,
} from '../tsTypes/error.types';
import { AppError } from '../utils/appError';
import config from '../utils/config';

const unknownRouteHandler = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  next(
    new AppError({
      message: `The route ${req.originalUrl} does not exist on this server`,
      statusCode: ErrorStatusCode.NOT_FOUND,
    })
  );
};

const sendErrorDev = (err: AppError, res: Response) => {
  console.log('🟠 ERROR ---> ', err);
  res.status(err.statusCode || 500).json({
    statusCode: err.statusCode || 500,
    error: err,
    name: err.name,
    message: err.message,
    stack: err.stack,
    additionalInfo: err?.additionalInfo,
  });
};

const sendErrorProd = (err: AppError, res: Response) => {
  if (err.isOperational) {
    console.log('🟢 ERROR ---> ', err);
    //NOTE: Operational trusted errors
    res.status(err.statusCode).json({
      name: err.name,
      statusCode: err.statusCode,
      status: err.status,
      message: err.message,
    });
  } else {
    //NOTE: Programming or other unkown errors : don't leak details
    res.status(500).json({
      statusCode: ErrorStatusCode.INTERNAL_SERVER_ERROR,
      name: 'ERROR',
      message: 'Something went very wrong!',
    });
  }
};

const handleDBCastError = (err: MongooseCastError): AppError => {
  const message = `Invalid : ${err.path} .`;
  return new AppError({ message, statusCode: 400 });
};

const handleDBValidationError = (err: MongooseValidationError): Error => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError({ message, statusCode: 400 });
};

const handleDBDuplicateFields = (err: MongoError): Error => {
  if (err && err.errmsg) {
    const match = err.errmsg.match(/(["'])(\\?.)*?\1/);
    if (match) {
      const value = match[0];
      const message = `Duplicate field value: ${value}. Please use another value!`;
      return new AppError({ message, statusCode: 400 });
    }
  }
  return new AppError({
    message: 'An unknown error occurred',
    statusCode: 500,
  });
};

//TODO: complete error handler asap
const errorHandler = (
  err: AppError,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  if (config.NODE_ENV === 'prod') {
    sendErrorDev(err, res);
  } else if (config.NODE_ENV === 'dev') {
    let errorCopy = Object.assign(err);

    if (errorCopy.name === 'CastError') {
      errorCopy = handleDBCastError(errorCopy);
    }
    if (errorCopy.name === 'ValidationError') {
      errorCopy = handleDBValidationError(errorCopy);
    }
    if (errorCopy.code === 11000) {
      errorCopy = handleDBDuplicateFields(errorCopy);
    }
    sendErrorProd(errorCopy, res);
  }
  next();
};

export default { unknownRouteHandler, errorHandler };
