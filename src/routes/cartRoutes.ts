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
  .get(cartController.getCartById)
  .delete(cartController.deleteOneCart)
  .patch((_req, res) => {
    res.send('edit specific cart');
  });

export default router;
