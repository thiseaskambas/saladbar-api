import { ErrorStatusCode } from '../tsTypes/error.types';

interface AppErrorArgs {
  name?: string;
  statusCode: ErrorStatusCode;
  message: string;
  status?: string;
  additionalInfo?: any;
}

export class AppError extends Error {
  public statusCode: ErrorStatusCode;
  public message: string;
  public status: string;
  public additionalInfo: any = {};
  public isOperational: boolean = true;

  constructor(args: AppErrorArgs) {
    super(args.message);

    Object.setPrototypeOf(this, new.target.prototype);

    this.statusCode = args.statusCode || ErrorStatusCode.INTERNAL_SERVER_ERROR;
    this.status = `${this.statusCode}`.startsWith('4') ? 'Fail' : 'Error';
    this.message = args.message;
    this.additionalInfo = args.additionalInfo;
    this.isOperational = true;

    Error.captureStackTrace(this);
  }
}
