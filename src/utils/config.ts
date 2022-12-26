import * as dotenv from 'dotenv';
import { NodeEnv } from '../tsTypes/utils.types';
import {
  parseEmail,
  parseEmailCredentials,
  parseNodeEnv,
  parseSecret,
  parseUri,
  parseDuration,
} from '../tsUtils/parsers';

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

const ACCESS_TOKEN_DURATION: string = parseDuration(
  process.env.ACCESS_TOKEN_DURATION
);

const REFRESH_TOKEN_SECRET: string = parseSecret(
  process.env.REFRESH_TOKEN_SECRET
);

const GMAIL_NODEMAILER_PSW: string = parseEmailCredentials(
  process.env.GMAIL_NODEMAILER_PSW
);
const GMAIL_EMAIL: string = parseEmail(process.env.GMAIL_EMAIL);

const CLOUDINARY_NAME = process.env.CLOUDINARY_NAME;
const CLOUDINARY_KEY = process.env.CLOUDINARY_KEY;
const CLOUDINARY_SECRET = process.env.CLOUDINARY_SECRET;

export default {
  NODE_ENV,
  DB_URI,
  PORT,
  ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_DURATION,
  REFRESH_TOKEN_SECRET,
  GMAIL_NODEMAILER_PSW,
  GMAIL_EMAIL,
  CLOUDINARY_NAME,
  CLOUDINARY_KEY,
  CLOUDINARY_SECRET,
};
