import { pool } from '../config/db.js';

// Scoring weights — a vote counts more than reactions.
const POINTS_PER_VOTE = 10;
const POINTS_PER_COMMENT = 5;
const POINTS_PER_LIKE = 2;

// GET /api/leaderboard?limit=&range=week|month|all
//
// Ranks users by the real engagement their uploaded talents earned:
//   score = votes*10 + comments*5 + likes*2
// Talents are matched to their author by handle (falling back to name only
// when no registered user owns that handle, so a post is never double-counted).
// `range` limits which talents count toward the score by t.created_at:
//   week  -> last 7 days, month -> last 30 days, all (default) -> everything.
// The date predicate lives in the JOIN's ON clause (not WHERE) so creators
// with no posts in the window still appear with score 0 instead of vanishing.
export async function listLeaderboard(req, res) {
  const limit = Math.min(Math.max(Number(req.query.limit) || 8, 1), 50);
  const range = String(req.query.range || 'all').toLowerCase();
  const days = range === 'week' ? 7 : range === 'month' ? 30 : 0;
  const dateClause = days > 0 ? `AND t.created_at >= NOW() - INTERVAL ${days} DAY` : '';
  try {
    const [rows] = await pool.query(
      `SELECT u.id, u.name, u.handle, u.avatar, u.category, u.role,
              COUNT(t.id) AS talent_count,
              COALESCE(SUM(t.votes), 0) AS total_votes,
              COALESCE(SUM(t.likes), 0) AS total_likes,
              COALESCE(SUM(t.comments_count), 0) AS total_comments,
              (COALESCE(SUM(t.votes), 0) * ? +
               COALESCE(SUM(t.comments_count), 0) * ? +
               COALESCE(SUM(t.likes), 0) * ?) AS score
         FROM users u
         LEFT JOIN talents t
           ON (t.author_handle = u.handle
               OR (t.author_name = u.name
                   AND NOT EXISTS (SELECT 1 FROM users u2 WHERE u2.handle = t.author_handle)))
              ${dateClause}
        GROUP BY u.id, u.name, u.handle, u.avatar, u.category, u.role
        ORDER BY score DESC, talent_count DESC
        LIMIT ${limit}`,
      [POINTS_PER_VOTE, POINTS_PER_COMMENT, POINTS_PER_LIKE],
    );
    const leaderboard = rows.map((u, i) => ({
      rank: i + 1,
      id: u.id,
      name: u.name,
      handle: u.handle,
      avatar: u.avatar,
      category: u.category || (u.role === 'creator' ? 'Creator' : 'Audience'),
      score: Number(u.score),
      likes: Number(u.total_likes),
      votes: Number(u.total_votes),
      comments: Number(u.total_comments),
      talentCount: Number(u.talent_count),
      isTop3: i < 3,
    }));
    return res.json({ leaderboard });
  } catch (err) {
    console.error('[leaderboard]', err.message);
    return res.status(500).json({ error: 'Could not load leaderboard' });
  }
}
