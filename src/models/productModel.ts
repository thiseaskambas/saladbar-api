import mongoose from 'mongoose';

import { IProduct } from '../utils/tsTypes';

const productSchema = new mongoose.Schema<IProduct>({
  name: {
    type: String,
    required: [true, 'Products must have a name'],
  },
  quantity: {
    type: Number,
    required: [true, 'Products must have a quantity of zero or more'],
    min: 0,
  },
  price: {
    type: Number,
    required: [true, 'Products must have a price of zero or more'],
    min: 0,
  },
});

const Product = mongoose.model<IProduct>('Product', productSchema);

export default Product;
