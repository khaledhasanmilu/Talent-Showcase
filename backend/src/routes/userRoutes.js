import { Router } from 'express';
import { pool } from '../config/db.js';
import { authRequired } from '../middleware/auth.js';

const router = Router();

// GET /api/users?search= (auth) — search real users to start a conversation.
router.get('/users', authRequired, async (req, res) => {
  const search = String(req.query.search || '').trim();
  try {
    let rows;
    if (search) {
      const like = `%${search}%`;
      const [result] = await pool.query(
        `SELECT id, name, handle, avatar, location, role, category
           FROM users
          WHERE id <> ? AND (name LIKE ? OR handle LIKE ?)
          ORDER BY score DESC LIMIT 20`,
        [req.userId, like, like],
      );
      rows = result;
    } else {
      const [result] = await pool.query(
        `SELECT id, name, handle, avatar, location, role, category
           FROM users
          WHERE id <> ?
          ORDER BY score DESC LIMIT 20`,
        [req.userId],
      );
      rows = result;
    }
    return res.json({ users: rows });
  } catch (err) {
    console.error('[users-list]', err.message);
    return res.status(500).json({ error: 'Could not load users' });
  }
});

export default router;