import * as dotenv from 'dotenv';
import { parseUri } from './tsUtils.js';

dotenv.config();

const PORT = process.env.PORT;

const DB_URI: string =
  process.env.NODE_ENV === 'dev'
    ? parseUri(process.env.DB_URI_DEV)
    : parseUri(process.env.DB_URI_PROD);

export default {
  DB_URI,
  PORT,
};
