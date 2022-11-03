import { Router } from 'express';
import authControllers from '../controllers/authController';

const router = Router();

router.post('/signup', authControllers.signUp);
router.post('/login', authControllers.logIn);

export default router;
