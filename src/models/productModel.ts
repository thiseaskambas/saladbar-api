import mongoose from 'mongoose';

import { IProduct } from '../utils/tsTypes';

const productSchema = new mongoose.Schema<IProduct>({
  name: {
    type: String,
    required: [true, 'Products must have a name'],
  },

  price: {
    type: Number,
    required: [true, 'Products must have a price of zero or more'],
    min: 0,
  },
});

productSchema.set('toJSON', {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Product = mongoose.model<IProduct>('Product', productSchema);

export default Product;
