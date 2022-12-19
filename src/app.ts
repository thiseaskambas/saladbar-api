import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import productsRouter from './routes/productRoutes';
import cartRouter from './routes/cartRoutes';
import authRouter from './routes/authRoutes';
import refreshTokenRouter from './routes/refreshTokenRoutes';
import usersRouter from './routes/usersRoutes';
import logoutRouter from './routes/logoutRoutes';
import errorController from './controllers/errorController';
import config from './utils/config';
import cookieParser from 'cookie-parser';
import { verifyJWT } from './middleware/verifyJWT';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

mongoose
  .connect(config.DB_URI)
  .then(() => console.log('connected to DB'))
  .catch((err) => console.log(err));

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/refresh', refreshTokenRouter);
app.use('/api/v1/logout', verifyJWT, logoutRouter);
app.use('/api/v1/users', verifyJWT, usersRouter);
app.use('/api/v1/products', verifyJWT, productsRouter);
app.use('/api/v1/carts', verifyJWT, cartRouter);
app.all('*', errorController.unknownRouteHandler);

app.use(errorController.errorHandler);
export default app;
