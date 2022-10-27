import { Router } from 'express';

import cartController from '../controllers/cartController';
const router = Router();

router
  .route('/')
  .get(cartController.getAllCarts)
  .post(cartController.createCart)
  .delete(cartController.deleteAllCarts);

export default router;
