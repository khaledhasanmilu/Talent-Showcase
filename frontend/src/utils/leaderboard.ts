import type { LeaderboardUser, TalentItem } from '../types';

const POINTS_PER_VOTE = 10;
const POINTS_PER_COMMENT = 5;
const POINTS_PER_LIKE = 2;

/**
 * Build a leaderboard purely from talent posts under each profile.
 * Groups talents by author handle (fallback: name), sums their
 * votes/likes/comments, scores with the same formula as the backend:
 * votes*10 + comments*5 + likes*2. Used as offline fallback and to
 * keep the board in sync right after a local like/vote/comment.
 *
 * `range` mirrors GET /api/leaderboard?range=: only talents whose
 * createdAt falls inside the window count toward the score.
 * Unparseable dates (e.g. "Just Now", "2h ago") are treated as recent
 * so they still appear in week/month boards instead of vanishing.
 */
export type LeaderboardRange = 'week' | 'month' | 'all';

function isInRange(createdAt: string | undefined, range: LeaderboardRange, now: number): boolean {
  if (range === 'all') return true;
  if (!createdAt) return true;
  const parsed = Date.parse(createdAt);
  if (Number.isNaN(parsed)) return true; // relative labels like "2h ago" / "Just Now" = recent
  const days = range === 'week' ? 7 : 30;
  return now - parsed <= days * 24 * 60 * 60 * 1000;
}

export function buildLeaderboardFromTalents(
  talents: TalentItem[],
  range: LeaderboardRange = 'all',
  now: number = Date.now(),
): LeaderboardUser[] {
  const byAuthor = new Map<
    string,
    {
      name: string;
      handle: string;
      avatar: string;
      category: string;
      votes: number;
      likes: number;
      comments: number;
      talentCount: number;
    }
  >();

  for (const t of talents) {
    if (!isInRange(t.createdAt, range, now)) continue;
    const key = t.authorHandle || t.authorName;
    const prev =
      byAuthor.get(key) ||
      {
        name: t.authorName,
        handle: t.authorHandle,
        avatar: t.authorAvatar,
        category: t.category,
        votes: 0,
        likes: 0,
        comments: 0,
        talentCount: 0,
      };
    prev.votes += t.votes || 0;
    prev.likes += t.likes || 0;
    prev.comments += t.commentsCount || 0;
    prev.talentCount += 1;
    if (!prev.avatar && t.authorAvatar) prev.avatar = t.authorAvatar;
    byAuthor.set(key, prev);
  }

  return [...byAuthor.values()]
    .map((u, i) => ({
      rank: i + 1, // reassigned after sort below
      id: `local-${u.handle || u.name}`,
      name: u.name,
      handle: u.handle,
      avatar: u.avatar,
      category: u.category,
      score: u.votes * POINTS_PER_VOTE + u.comments * POINTS_PER_COMMENT + u.likes * POINTS_PER_LIKE,
      likes: u.likes,
      votes: u.votes,
      comments: u.comments,
      talentCount: u.talentCount,
      isTop3: false,
    }))
    .sort((a, b) => b.score - a.score || b.talentCount - a.talentCount)
    .map((u, i) => ({ ...u, rank: i + 1, isTop3: i < 3 }));
}
