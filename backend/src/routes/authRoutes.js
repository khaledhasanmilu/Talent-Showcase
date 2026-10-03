import { Router } from 'express';
import { login, me, register, updateProfile } from '../controllers/authController.js';
import { authRequired } from '../middleware/auth.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authRequired, me);
router.put('/me', authRequired, updateProfile);

export default router;
