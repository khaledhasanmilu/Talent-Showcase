import { pool } from '../config/db.js';

// Scoring weights — a vote counts more than reactions.
const POINTS_PER_VOTE = 10;
const POINTS_PER_COMMENT = 5;
const POINTS_PER_LIKE = 2;

// GET /api/leaderboard?limit=&range=week|month|all
//
// Ranks users by the real engagement their uploaded talents earned:
//   score = net_votes*10 + net_comments*5 + net_likes*2
// where net_* = feed counter minus the author's own like/vote/comments on
// their own posts. So self-boosts still bump the feed card number (talents
// table), but they contribute 0 here and can't move the board.
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
  const dateClauseT2 = days > 0 ? `AND t2.created_at >= NOW() - INTERVAL ${days} DAY` : '';
  // Author-match shared by the feed join and the self-engagement subqueries.
  const authorMatchT = `(t.author_handle = u.handle
                OR (t.author_name = u.name
                    AND NOT EXISTS (SELECT 1 FROM users u2 WHERE u2.handle = t.author_handle)))`;
  const authorMatchT2 = `(t2.author_handle = u.handle
                OR (t2.author_name = u.name
                    AND NOT EXISTS (SELECT 1 FROM users u3 WHERE u3.handle = t2.author_handle)))`;
  try {
    const [rows] = await pool.query(
      `SELECT agg.id, agg.name, agg.handle, agg.avatar, agg.category, agg.role,
              agg.talent_count,
              GREATEST(0, agg.gross_votes - agg.self_votes) AS total_votes,
              GREATEST(0, agg.gross_likes - agg.self_likes) AS total_likes,
              GREATEST(0, agg.gross_comments - agg.self_comments) AS total_comments,
              (GREATEST(0, agg.gross_votes - agg.self_votes) * ? +
               GREATEST(0, agg.gross_comments - agg.self_comments) * ? +
               GREATEST(0, agg.gross_likes - agg.self_likes) * ?) AS score
         FROM (
           SELECT u.id, u.name, u.handle, u.avatar, u.category, u.role,
                  COUNT(t.id) AS talent_count,
                  COALESCE(SUM(t.votes), 0) AS gross_votes,
                  COALESCE(SUM(t.likes), 0) AS gross_likes,
                  COALESCE(SUM(t.comments_count), 0) AS gross_comments,
                  COALESCE((
                    SELECT COUNT(*)
                      FROM talents t2
                      JOIN content_interactions ci
                        ON ci.talent_id = t2.id AND ci.user_id = u.id AND ci.voted = 1
                     WHERE ${authorMatchT2} ${dateClauseT2}
                  ), 0) AS self_votes,
                  COALESCE((
                    SELECT COUNT(*)
                      FROM talents t2
                      JOIN content_interactions ci
                        ON ci.talent_id = t2.id AND ci.user_id = u.id AND ci.liked = 1
                     WHERE ${authorMatchT2} ${dateClauseT2}
                  ), 0) AS self_likes,
                  COALESCE((
                    SELECT COUNT(*)
                      FROM talents t2
                      JOIN comments c
                        ON c.talent_id = t2.id AND c.user_id = u.id
                     WHERE ${authorMatchT2} ${dateClauseT2}
                  ), 0) AS self_comments
             FROM users u
             LEFT JOIN talents t
               ON ${authorMatchT}
                  ${dateClause}
            GROUP BY u.id, u.name, u.handle, u.avatar, u.category, u.role
         ) AS agg
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
