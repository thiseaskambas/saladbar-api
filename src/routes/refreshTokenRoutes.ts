import { Router } from 'express';
import refreshTokenController from '../controllers/refreshTokenController';

const router = Router();

router.get('/', refreshTokenController.handleRefreshToken);

export default router;
