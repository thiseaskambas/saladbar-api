import { Router } from 'express';
import productsController from '../controllers/productController';
import { restrictTo } from '../middleware/restrictTo';

const router = Router();

router
  .route('/')
  .get(productsController.getAllProducts)
  .post(restrictTo('admin', 'dev'), productsController.createProduct)
  .delete(productsController.deleteAllDevProducts); // Dev environment only

router
  .route('/:id')
  .get(productsController.getProductById)
  .delete(restrictTo('admin', 'dev'), productsController.deactivateOneProduct)
  .patch(restrictTo('admin', 'dev'), productsController.editProduct);
router
  .route('/:id/deactivated')
  .delete(restrictTo('admin', 'dev'), productsController.deleteOneProduct);
export default router;
