import { Schema, model } from 'mongoose';
import { ICart, ICartItem } from '../utils/tsTypes';

const cartItemSchema = new Schema<ICartItem>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'only existing products can be added to the cart'],
    },
    quantity: Number,
    totalPrice: Number,
  },
  { _id: false }
);

const cartSchema = new Schema<ICart>(
  {
    items: [{ type: cartItemSchema, required: [true, 'cart cannot be empty'] }],
    createdAt: {
      type: Date,
      default: new Date(),
      required: [true, 'a cart must have a date'],
    },
    totalPrice: {
      type: Number,
      default: 0,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

cartSchema.pre('save', (next) => {
  console.log('this : ', this);
  next();
});

const Cart = model<ICart>('Cart', cartSchema);

export default Cart;
