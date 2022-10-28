import { Router } from 'express';
import productsController from '../controllers/productsController';

const router = Router();

router
  .route('/')
  .get(productsController.getAllProducts)
  .post(productsController.createProduct)
  .delete(productsController.deleteAllProducts);

router
  .route('/:id')
  .get(productsController.getProductById)
  .delete(productsController.deleteOneProduct)
  .patch((_req, res) => {
    res.send('edit specific product');
  });

export default router;
