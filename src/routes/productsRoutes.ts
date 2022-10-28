import { Router } from 'express';
import productsController from '../controllers/productsController';

const router = Router();

router
  .route('/')
  .get(productsController.getAllProducts)
  .post(productsController.createProduct)
  .delete(productsController.deleteAllProduct);

router
  .route('/:id')
  .get((_req, res) => {
    res.send('get specific product');
  })
  .patch((_req, res) => {
    res.send('edit specific product');
  })
  .delete((_req, res) => {
    res.send('delete specific product');
  });

export default router;
