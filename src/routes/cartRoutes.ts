import { Router } from 'express';

import cartController from '../controllers/cartController';
const router = Router();

router
  .route('/')
  .get(cartController.getAllCarts)
  .post(cartController.createCart)
  .delete(cartController.deleteAllCarts);

router
  .route('/:id')
  .get((_req, res) => {
    res.send('get specific cart');
  })
  .patch((_req, res) => {
    res.send('edit specific cart');
  })
  .delete((_req, res) => {
    res.send('delete specific cart');
  });

export default router;
