import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';

import productsRouter from './routes/productRoutes';
import messageRouter from './routes/messageRoutes';
import cartRouter from './routes/cartRoutes';
import authRouter from './routes/authRoutes';
import refreshTokenRouter from './routes/refreshTokenRoutes';
import usersRouter from './routes/usersRoutes';
import logoutRouter from './routes/logoutRoutes';
import errorController from './controllers/errorController';
import config from './utils/config';
import cookieParser from 'cookie-parser';
import { verifyJWT } from './middleware/verifyJWT';
import { AppError } from './utils/appError';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

const app = express();
app.use(helmet());
app.use(limiter);
app.use(cors());
app.options('*', cors());
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());
app.use(mongoSanitize());
// app.use(xss());
app.use(hpp());
app.set('trust proxy', 1);
// app.get('/ip', (request, response) => response.send(request.ip));

mongoose
  .connect(config.DB_URI)
  .then(() => console.log('connected to DB'))
  .catch((_err) => {
    throw new AppError({ message: 'Connection to DB failed', statusCode: 500 });
  });

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/refresh', refreshTokenRouter);
app.use('/api/v1/logout', verifyJWT, logoutRouter);
app.use('/api/v1/message', verifyJWT, messageRouter);
app.use('/api/v1/users', verifyJWT, usersRouter);
app.use('/api/v1/products', verifyJWT, productsRouter);
app.use('/api/v1/carts', verifyJWT, cartRouter);
app.all('*', errorController.unknownRouteHandler);

app.use(errorController.errorHandler);
export default app;
