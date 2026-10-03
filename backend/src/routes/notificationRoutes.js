import { Router } from 'express';
import {
  listNotifications,
  markAllRead,
  markRead,
} from '../controllers/notificationController.js';
import { authRequired } from '../middleware/auth.js';

const router = Router();

router.get('/', authRequired, listNotifications);
router.post('/read', authRequired, markAllRead);
router.post('/:id/read', authRequired, markRead);

export default router;