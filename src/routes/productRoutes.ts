import { Router } from 'express';
import productsController from '../controllers/productController';
import { upload } from '../utils/cloudinary';

const router = Router();

router
  .route('/')
  .get(productsController.getAllProducts)
  .post(upload.single('image'), productsController.createProduct)
  .delete(productsController.deleteAllDevProducts); // Dev environment only

router
  .route('/:id')
  .get(productsController.getProductById)
  .delete(productsController.deleteOneProduct)
  .patch(productsController.editProduct);

export default router;
