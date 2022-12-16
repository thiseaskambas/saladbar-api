export class CustomError {
  message!: string;
  status!: number;
  isOperational: boolean;

  constructor(
    message: string = 'Something went wrong. Please try again.',
    status: number = 500
  ) {
    this.message = message;
    this.status = status;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}
