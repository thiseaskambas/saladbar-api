import express from 'express';

const router = express.Router();

router
  .route('/')
  .get((_req, res) => {
    res.send('all products');
  })
  .post((_req, res) => {
    res.send('creating products');
  });

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
