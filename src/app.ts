import express from 'express';
import mongoose from 'mongoose';

import productsRouter from './routes/productsRoutes';
import cartRouter from './routes/cartRoutes';
import config from './utils/config';

const app = express();
app.use(express.json());

mongoose
  .connect(config.DB_URI)
  .then(() => console.log('connected to DB'))
  .catch((err) => console.log(err));

app.use('/api/v1/products', productsRouter);
app.use('/api/v1/carts', cartRouter);

export default app;
