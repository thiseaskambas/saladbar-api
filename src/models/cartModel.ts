import { Schema, model } from 'mongoose';
import { ICart, ICartItem, IProduct } from '../utils/tsTypes';
import Product from './productModel';

const cartItemSchema = new Schema<ICartItem>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'only existing products can be added to the cart'],
    },
    quantity: {
      type: Number,
      required: [true, 'quantity must be provided'],
      min: 1,
      max: 999999,
    },
    totalPrice: { type: Number, default: 0 },
    itemPrice: { type: Number, default: 0 },
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
    toJSON: {
      virtuals: true,
      transform: function (_doc, ret) {
        delete ret.__v;
        delete ret._id;
      },
    },
  }
);

cartItemSchema.pre('save', async function (next) {
  const self: ICartItem = this;
  const product: IProduct | null = await Product.findOne(self.product);
  if (product) {
    self.totalPrice = product.price * self.quantity;
    self.itemPrice = product.price;
    next();
  } else {
    throw new Error(`No products found with the given id : ${self.product} `);
  }
});

cartSchema.pre('save', async function (next) {
  const self: ICart = this;
  const totalCartPrice = self.items.reduce((acc, cv) => {
    return acc + cv.totalPrice;
  }, 0);
  self.totalPrice = totalCartPrice;

  next();
});

cartSchema.pre(/^find/, function (next) {
  this.populate({ path: 'items.product', select: 'name' });
  next();
});

const Cart = model<ICart>('Cart', cartSchema);

export default Cart;
