import { v2 as cloudinary } from 'cloudinary';

import config from '../utils/config';

declare interface cloudinaryOptions extends Options {
  params: {
    folder: string;
    allowedFormats: string[];
  };
}

cloudinary.config({
  cloud_name: config.CLOUDINARY_NAME,
  api_key: config.CLOUDINARY_KEY,
  api_secret: config.CLOUDINARY_SECRET,
  secure: config.NODE_ENV === 'prod',
});

const multerOpts: cloudinaryOptions = {
  cloudinary,
  params: {
    folder: config.NODE_ENV === 'prod' ? 'saladBar' : 'saladBarDev',
    allowedFormats: ['jpeg', 'png', 'jpg'],
  },
};

const storage = new CloudinaryStorage(multerOpts);

export const upload = multer({ storage: storage });
