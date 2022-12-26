import { Router } from 'express';
import messageController from '../controllers/messageController';
import { restrictTo } from '../middleware/restrictTo';

const router = Router();
router
  .route('/')
  .get(messageController.getAllMessages)
  .post(restrictTo('admin', 'dev'), messageController.createMessage);

router.route('/latest').get(messageController.getLatestMessage);
router
  .route('/:id')
  .get(messageController.getMessageById)
  .delete(restrictTo('admin', 'dev'), messageController.deleteMessage);

export default router;
