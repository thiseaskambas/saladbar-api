import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import authController from '../controllers/authController';

const router = Router();

const createAccountLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message:
    'Too many accounts created from this IP, please try again after an hour',
  standardHeaders: true,
  legacyHeaders: false,
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: 'Too many login attempts from this IP, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/signup', createAccountLimiter, authController.signUp);
router.post('/login', loginLimiter, authController.logIn);
router.post('/forgot-password', authController.forgotPassword);
router.patch('/reset-password/:id/:resetToken', authController.resetPassword);

export default router;
