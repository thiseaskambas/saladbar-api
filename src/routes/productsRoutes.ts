import express from 'express';
import productsController from '../controllers/productsController';

const router = express.Router();

router
  .route('/')
  .get(productsController.getAllProducts)
  .post(productsController.createProduct);

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
