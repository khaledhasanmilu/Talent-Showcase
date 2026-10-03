import { pool } from '../config/db.js';
import { mapComment, mapUserPublic } from '../utils/mappers.js';

// GET /api/talents/:id/comments  (optional auth decorates isLiked)
export async function listComments(req, res) {
  const { id } = req.params;
  try {
    const [rows] = await pool.query(
      'SELECT * FROM comments WHERE talent_id = ? ORDER BY created_at ASC LIMIT 200',
      [id],
    );

    let likedSet = new Set();
    if (req.userId && rows.length > 0) {
      const ids = rows.map((c) => c.id);
      const placeholders = ids.map(() => '?').join(',');
      const [likes] = await pool.query(
        `SELECT comment_id FROM comment_likes WHERE user_id = ? AND comment_id IN (${placeholders})`,
        [req.userId, ...ids],
      );
      likedSet = new Set(likes.map((l) => l.comment_id));
    }

    return res.json({ comments: rows.map((c) => mapComment(c, likedSet.has(c.id))) });
  } catch (err) {
    console.error('[comments-list]', err.message);
    return res.status(500).json({ error: 'Could not load comments' });
  }
}

// POST /api/talents/:id/comments (auth) — publish a comment
export async function createComment(req, res) {
  const { id } = req.params;
  const { text } = req.body || {};

  if (!text || !String(text).trim()) {
    return res.status(400).json({ error: 'Comment text is required' });
  }

  try {
    const [talents] = await pool.query('SELECT id FROM talents WHERE id = ? LIMIT 1', [id]);
    if (talents.length === 0) {
      return res.status(404).json({ error: 'Talent not found' });
    }

    const [users] = await pool.query('SELECT * FROM users WHERE id = ? LIMIT 1', [req.userId]);
    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    const author = users[0];

    const commentId = `comment-${Date.now()}`;
    await pool.query(
      'INSERT INTO comments (id, talent_id, user_id, author_name, author_avatar, text) VALUES (?, ?, ?, ?, ?, ?)',
      [commentId, id, req.userId, author.name, author.avatar, String(text).trim()],
    );
    await pool.query('UPDATE talents SET comments_count = comments_count + 1 WHERE id = ?', [id]);

    const [rows] = await pool.query('SELECT * FROM comments WHERE id = ? LIMIT 1', [commentId]);
    return res.status(201).json({ comment: mapComment(rows[0]) });
  } catch (err) {
    console.error('[comments-create]', err.message);
    return res.status(500).json({ error: 'Could not publish comment' });
  }
}

// POST /api/comments/:commentId/like (auth) — toggle comment like
export async function toggleCommentLike(req, res) {
  const { commentId } = req.params;
  try {
    const [comments] = await pool.query('SELECT id, likes FROM comments WHERE id = ? LIMIT 1', [
      commentId,
    ]);
    if (comments.length === 0) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    const [existing] = await pool.query(
      'SELECT comment_id FROM comment_likes WHERE user_id = ? AND comment_id = ? LIMIT 1',
      [req.userId, commentId],
    );
    const alreadyLiked = existing.length > 0;

    if (alreadyLiked) {
      await pool.query('DELETE FROM comment_likes WHERE user_id = ? AND comment_id = ?', [
        req.userId,
        commentId,
      ]);
      await pool.query('UPDATE comments SET likes = GREATEST(0, likes - 1) WHERE id = ?', [commentId]);
    } else {
      await pool.query(
        'INSERT INTO comment_likes (user_id, comment_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE comment_id = comment_id',
        [req.userId, commentId],
      );
      await pool.query('UPDATE comments SET likes = likes + 1 WHERE id = ?', [commentId]);
    }

    const [rows] = await pool.query('SELECT * FROM comments WHERE id = ? LIMIT 1', [commentId]);
    return res.json({ comment: mapComment(rows[0], !alreadyLiked), active: !alreadyLiked });
  } catch (err) {
    console.error('[comments-like]', err.message);
    return res.status(500).json({ error: 'Could not toggle comment like' });
  }
}