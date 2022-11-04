import { Router } from 'express';
import authController from '../controllers/authController';

const router = Router();

router.post('/signup', authController.signUp);
router.post('/login', authController.logIn);
router.post('/forgot-password', authController.forgotPassword);
router.patch('/reset-password/:id/:resetToken', authController.resetPassword);

export default router;
