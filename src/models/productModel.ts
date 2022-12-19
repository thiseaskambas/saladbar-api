import mongoose from 'mongoose';

import { IProduct, IProductImage } from '../tsTypes';

const ImageSchema = new mongoose.Schema<IProductImage>({
  url: {
    type: String,
    required: true,
  },
  filename: String,
  secure_url: String,
  public_id: String,
});

const productSchema = new mongoose.Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, 'Products must have a name'],
      unique: true,
    },

    price: {
      type: Number,
      required: [true, 'Products must have a price of zero or more'],
      min: 0,
    },
    productCourseType: {
      type: String,
      required: [true, 'product must have be a CourseType'],
      enum: {
        values: ['starter', 'main', 'desert', 'drink', 'side', 'other'],
        message:
          'CourseType is "starter", "main", "desert", "drink" OR "other"',
      },
    },
    active: {
      type: Boolean,
      required: [true, 'a product must be active true/false'],
      default: true,
    },
    image: {
      type: ImageSchema,
    },
  },
  {
    toJSON: {
      virtuals: true,
      transform: function (_doc, ret) {
        delete ret.__v;
        delete ret._id;
      },
    },
  }
);

const Product = mongoose.model<IProduct>('Product', productSchema);

export default Product;
