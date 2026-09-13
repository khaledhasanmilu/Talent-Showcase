import { pool } from '../config/db.js';

// GET /api/leaderboard?limit=
export async function listLeaderboard(req, res) {
  const limit = Math.min(Math.max(Number(req.query.limit) || 8, 1), 50);
  try {
    const [rows] = await pool.query(
      `SELECT * FROM users ORDER BY score DESC, talent_count DESC LIMIT ${limit}`,
    );
    const leaderboard = rows.map((u, i) => ({
      rank: i + 1,
      id: u.id,
      name: u.name,
      handle: u.handle,
      avatar: u.avatar,
      category: u.category || (u.role === 'creator' ? 'Creator' : 'Audience'),
      score: u.score,
      likes: u.likes,
      votes: u.votes,
      talentCount: u.talent_count,
      isTop3: i < 3,
    }));
    return res.json({ leaderboard });
  } catch (err) {
    console.error('[leaderboard]', err.message);
    return res.status(500).json({ error: 'Could not load leaderboard' });
  }
}
