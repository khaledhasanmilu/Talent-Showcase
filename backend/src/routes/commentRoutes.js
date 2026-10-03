import { Router } from 'express';
import {
  createComment,
  listComments,
  toggleCommentLike,
} from '../controllers/commentController.js';
import { authOptional } from '../middleware/authOptional.js';
import { authRequired } from '../middleware/auth.js';

const router = Router();

router.get('/talents/:id/comments', authOptional, listComments);
router.post('/talents/:id/comments', authRequired, createComment);
router.post('/comments/:commentId/like', authRequired, toggleCommentLike);

export default router;