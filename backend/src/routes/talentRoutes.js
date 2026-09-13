import { Router } from 'express';
import { createTalent, listTalents } from '../controllers/talentController.js';
import { authRequired } from '../middleware/auth.js';

const router = Router();

router.get('/', listTalents);
router.post('/', authRequired, createTalent);

export default router;
