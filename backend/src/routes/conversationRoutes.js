import { Router } from 'express';
import {
  createConversation,
  listConversations,
  sendMessage,
} from '../controllers/conversationController.js';
import { authRequired } from '../middleware/auth.js';

const router = Router();

router.get('/', authRequired, listConversations);
router.post('/', authRequired, createConversation);
router.post('/:id/messages', authRequired, sendMessage);

export default router;