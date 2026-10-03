import { pool } from '../config/db.js';
import { relativeTime } from '../utils/mappers.js';

function mapNotification(row) {
  return {
    id: row.id,
    type: row.type,
    user: { name: row.actor_name, avatar: row.actor_avatar },
    message: row.message || '',
    talentTitle: row.talent_title || undefined,
    targetTalentId: row.talent_id || undefined,
    time: relativeTime(row.created_at),
    isRead: Boolean(row.is_read),
  };
}

// GET /api/notifications (auth)
export async function listNotifications(req, res) {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 50',
      [req.userId],
    );
    return res.json({ notifications: rows.map(mapNotification) });
  } catch (err) {
    console.error('[notifications-list]', err.message);
    return res.status(500).json({ error: 'Could not load notifications' });
  }
}

// POST /api/notifications/read (auth) — mark all read
export async function markAllRead(req, res) {
  try {
    await pool.query('UPDATE notifications SET is_read = 1 WHERE user_id = ?', [req.userId]);
    return res.json({ ok: true });
  } catch (err) {
    console.error('[notifications-read-all]', err.message);
    return res.status(500).json({ error: 'Could not update notifications' });
  }
}

// POST /api/notifications/:id/read (auth) — mark one read
export async function markRead(req, res) {
  const { id } = req.params;
  try {
    await pool.query('UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?', [
      id,
      req.userId,
    ]);
    return res.json({ ok: true });
  } catch (err) {
    console.error('[notifications-read-one]', err.message);
    return res.status(500).json({ error: 'Could not update notification' });
  }
}