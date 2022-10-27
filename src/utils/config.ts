import * as dotenv from 'dotenv';
import { NodeEnv } from './tsTypes';
import { parseNodeEnv, parseUri } from './tsUtils';

dotenv.config();

const PORT = process.env.PORT;

const NODE_ENV: NodeEnv = parseNodeEnv(process.env.NODE_ENV);

const DB_URI: string =
  NODE_ENV === 'dev'
    ? parseUri(process.env.DB_URI_DEV)
    : parseUri(process.env.DB_URI_PROD);

export default {
  NODE_ENV,
  DB_URI,
  PORT,
};
