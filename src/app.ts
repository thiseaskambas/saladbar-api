import express from 'express';
import mongoose from 'mongoose';

import productsRouter from './routes/productsRoutes';
import config from './utils/config';

const app = express();
app.use(express.json());

mongoose
  .connect(config.DB_URI)
  .then(() => console.log('connected to DB'))
  .catch((err) => console.log(err));

app.get('/ping', (_req, res) => {
  console.log('someone pinged here');
  res.send('pong');
});

app.use('/api/v1/products', productsRouter);

export default app;
