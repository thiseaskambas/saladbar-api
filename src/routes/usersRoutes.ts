import { Router } from 'express';
import userControllers from '../controllers/userControllers';

const router = Router();

router.get('/', userControllers.findAllUsers);
router.route('/:id').get(userControllers.findOneUser);

export default router;
