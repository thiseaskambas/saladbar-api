import { Router } from 'express';
import { restrictTo } from '../middleware/restrictTo';

const router = Router();
router.route('/').get().post(restrictTo('admin', 'dev'));
router
  .route('/:id')
  .get()
  .patch(restrictTo('admin', 'dev'))
  .delete(restrictTo('admin', 'dev'));

export default router;
