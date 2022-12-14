export interface ILoginCredentials {
  password: string;
  email: string;
}

export type NodeEnv = 'dev' | 'prod';

export interface IReqQueryAfterBeforeDate {
  after: string;
  before: string;
}

export interface IPaginationOptions {
  page: number;
  limit: number;
}
