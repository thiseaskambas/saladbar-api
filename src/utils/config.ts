import * as dotenv from 'dotenv';
import { NodeEnv } from './tsTypes';
import {
  parseEmailCredentials,
  parseNodeEnv,
  parseSecret,
  parseUri,
} from './tsUtils';

dotenv.config();

const PORT = process.env.PORT;

const NODE_ENV: NodeEnv = parseNodeEnv(process.env.NODE_ENV);

const DB_URI: string =
  NODE_ENV === 'dev'
    ? parseUri(process.env.DB_URI_DEV)
    : parseUri(process.env.DB_URI_PROD);

//TODO: type tokens correctly
const ACCESS_TOKEN_SECRET: string = parseSecret(
  process.env.ACCESS_TOKEN_SECRET
);
const REFRESH_TOKEN_SECRET: string = parseSecret(
  process.env.REFRESH_TOKEN_SECRET
);

const GMAIL_NODEMAILER_PSW: string = parseEmailCredentials(
  process.env.GMAIL_NODEMAILER_PSW
);
const GMAIL_EMAIL: string = parseEmailCredentials(process.env.GMAIL_EMAIL);

export default {
  NODE_ENV,
  DB_URI,
  PORT,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  GMAIL_NODEMAILER_PSW,
  GMAIL_EMAIL,
};
