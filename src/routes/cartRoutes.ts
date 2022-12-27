import { Router } from 'express';

import cartController from '../controllers/cartController';
import { restrictTo } from '../middleware/restrictTo';
const router = Router();

router
  .route('/')
  .get(cartController.getAllCarts)
  .post(cartController.createCart)
  .delete(cartController.deleteAllCarts); // Dev environment only

router
  .route('/:id')
  .get(cartController.getCartById)
  .patch(cartController.updateOneCart)
  // .delete(cartController.deactivateOneCart);
  .delete(cartController.deleteOneCart);
router
  .route('/:id/deactivated')
  .delete(restrictTo('admin', 'dev'), cartController.deleteOneCart);
export default router;
