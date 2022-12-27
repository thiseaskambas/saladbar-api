import { Router } from 'express';
import authController from '../controllers/authController';
import userControllers from '../controllers/userControllers';
import { restrictTo } from '../middleware/restrictTo';

const router = Router();

router.get('/', userControllers.findAllUsers);
router.route('/update-password/').patch(authController.updatePassword);
router.route('/:id').get(userControllers.findOneUser);
router
  .route('/:id')
  .patch(restrictTo('admin', 'dev'), userControllers.editUser);

export default router;
