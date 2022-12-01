import { v2 as cloudinary } from 'cloudinary';

import config from '../utils/config';

cloudinary.config({
  cloud_name: config.CLOUDINARY_NAME,
  api_key: config.CLOUDINARY_KEY,
  api_secret: config.CLOUDINARY_SECRET,
  secure: config.NODE_ENV === 'prod',
});

export const options = {
  folder: config.NODE_ENV === 'prod' ? 'saladBar' : 'saladBarDev',
  use_filename: true,
  unique_filename: true,
  overwrite: true,
  allowedFormats: ['jpeg', 'png', 'jpg'],
};

export default cloudinary;
