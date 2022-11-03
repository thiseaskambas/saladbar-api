import mongoose from 'mongoose';

import { IProduct } from '../utils/tsTypes';

const productSchema = new mongoose.Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, 'Products must have a name'],
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
