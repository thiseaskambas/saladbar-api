export enum ErrorStatusCode {
  OK = 200,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  INTERNAL_SERVER_ERROR = 500,
}
//NOTE: ref here https://developer.mozilla.org/en-US/docs/Web/HTTP/Status

export interface MongooseCastError extends Error {
  path: string;
  value: string;
}
export interface MongoError extends Error {
  stack?: string;
  code?: number;
  ok?: number;
  index: number;
  errmsg: string;
}

export interface MongooseValidationError {
  errors: MongooseCastError;
}
