import { Router } from 'express';
import {
  createTalent,
  listTalents,
  toggleLike,
  toggleSave,
  toggleVote,
} from '../controllers/talentController.js';
import { authOptional } from '../middleware/authOptional.js';
import { authRequired } from '../middleware/auth.js';

const router = Router();

router.get('/', authOptional, listTalents);
router.post('/', authRequired, createTalent);

router.post('/:id/like', authRequired, toggleLike);
router.post('/:id/vote', authRequired, toggleVote);
router.post('/:id/save', authRequired, toggleSave);

export default router;