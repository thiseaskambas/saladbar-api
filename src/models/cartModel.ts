import { Schema, model } from 'mongoose';
import { ICart, ICartItem, ILastEdited, IProduct } from '../tsTypes';
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
    itemPrice: { type: Number, default: 0 },
    itemPriceBeforeDiscount: { type: Number, default: 0 },
    totalPrice: { type: Number, default: 0 },
    totalPriceBeforeDiscount: { type: Number, default: 0 },
    discount: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
  },
  { _id: false }
);

const editedSchema = new Schema<ILastEdited>(
  {
    editDate: {
      type: Date,
      default: new Date(),
      required: [true, 'a cart must have a date'],
    },
    editedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'a cart must be edited by an existing user'],
    },
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
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'a cart must be created by an existing user'],
    },
    lastEdited: editedSchema,
    totalPrice: {
      type: Number,
      default: 0,
    },
    totalPriceBeforeDiscount: { type: Number, default: 0 },
    discount: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
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
    self.itemPriceBeforeDiscount = product.price;
    self.totalPriceBeforeDiscount = product.price * self.quantity;
    self.itemPrice = parseFloat(
      (product.price - (product.price * self.discount) / 100).toFixed(2)
    );
    self.totalPrice = parseFloat((self.itemPrice * self.quantity).toFixed(2));
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
  self.totalPriceBeforeDiscount = totalCartPrice;
  self.totalPrice = parseFloat(
    (totalCartPrice - (totalCartPrice * self.discount) / 100).toFixed(2)
  );

  next();
});

cartSchema.pre(/^find/, function (next) {
  this.populate({ path: 'items.product', select: 'name' });
  next();
});

const Cart = model<ICart>('Cart', cartSchema);

export default Cart;
