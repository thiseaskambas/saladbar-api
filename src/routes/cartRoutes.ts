import { Router } from 'express';
import Cart from '../models/cartModel';

const router = Router();

router
  .route('/')
  .get((_req, res) => {
    res.send('all carts');
  })
  .post(async (req, res) => {
    const cart = req.body;
    const savedCart = await Cart.create(cart);
    res.send(savedCart);
  })
  .delete(async (req, res) => {
    if (req.body.deleteAll === 'true') {
      await Cart.deleteMany({});
      return res.send('deleted all');
    }
    return res.send('no delete');
  });

export default router;
