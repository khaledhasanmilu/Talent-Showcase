import { pool } from '../config/db.js';
import { mapTalent, mapUserPublic } from '../utils/mappers.js';

const SAMPLE_VIDEO_URL =
  'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/friday.mp4';

const PLACEHOLDER_THUMBNAILS = {
  video: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop&q=80',
  audio: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
  text: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&auto=format&fit=crop&q=80',
};

// Fetch the requesting user's like/vote/save state for a set of talent ids.
async function getInteractions(userId, talentIds) {
  if (!userId || talentIds.length === 0) return new Map();
  const placeholders = talentIds.map(() => '?').join(',');
  const [rows] = await pool.query(
    `SELECT talent_id, liked, voted, saved FROM content_interactions
     WHERE user_id = ? AND talent_id IN (${placeholders})`,
    [userId, ...talentIds],
  );
  return new Map(rows.map((r) => [r.talent_id, { liked: r.liked, voted: r.voted, saved: r.saved }]));
}

// Apply per-user interaction flags to a list of mapped talents.
async function decorateWithInteractions(mapped, userId) {
  if (!userId || mapped.length === 0) return mapped;
  const interact = await getInteractions(userId, mapped.map((t) => t.id));
  return mapped.map((t) => {
    const it = interact.get(t.id) || {};
    return {
      ...t,
      isLiked: Boolean(it.liked),
      isVoted: Boolean(it.voted),
      isSaved: Boolean(it.saved),
    };
  });
}

// GET /api/talents?type=&category=&search=&limit=
export async function listTalents(req, res) {
  const { type, category, search } = req.query || {};
  const limit = Math.min(Math.max(Number(req.query.limit) || 50, 1), 100);

  const where = [];
  const params = [];
  if (type && ['audio', 'video', 'text'].includes(String(type))) {
    where.push('type = ?');
    params.push(String(type));
  }
  if (category && String(category) !== 'All') {
    where.push('category = ?');
    params.push(String(category));
  }
  if (search && String(search).trim()) {
    where.push('(title LIKE ? OR author_name LIKE ? OR description LIKE ?)');
    const like = `%${String(search).trim()}%`;
    params.push(like, like, like);
  }

  try {
    const [rows] = await pool.query(
      `SELECT * FROM talents
       ${where.length > 0 ? `WHERE ${where.join(' AND ')}` : ''}
       ORDER BY created_at DESC
       LIMIT ${limit}`,
      params,
    );
    const mapped = rows.map((row) => mapTalent(row));
    const decorated = await decorateWithInteractions(mapped, req.userId);
    return res.json({ talents: decorated });
  } catch (err) {
    console.error('[talents]', err.message);
    return res.status(500).json({ error: 'Could not load talents' });
  }
}

// POST /api/talents (auth required — author is taken from the JWT)
export async function createTalent(req, res) {
  const { title, type, category, description, poemText, tags, createdLabel, thumbnail, contentUrl, audioDuration } = req.body || {};

  if (!title || !String(title).trim()) {
    return res.status(400).json({ error: 'Title is required' });
  }
  if (!description || !String(description).trim()) {
    return res.status(400).json({ error: 'Description is required' });
  }
  if (!['audio', 'video', 'text'].includes(String(type))) {
    return res.status(400).json({ error: 'Type must be audio, video or text' });
  }
  if (!category || !String(category).trim()) {
    return res.status(400).json({ error: 'Category is required' });
  }
  if (String(type) === 'text' && (!Array.isArray(poemText) || poemText.length === 0)) {
    return res.status(400).json({ error: 'Poem content is required for text posts' });
  }

  try {
    const [users] = await pool.query('SELECT * FROM users WHERE id = ? LIMIT 1', [req.userId]);
    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    const author = users[0];

    const id = `talent-${Date.now()}`;
    const safeType = String(type);

    // Prefer a real thumbnail captured from the uploader's own video file.
    // Anything else (missing, wrong type, absurdly large) falls back to the
    // stock placeholder so publishing never breaks.
    const clientThumbnail =
      typeof thumbnail === 'string' && thumbnail.trim().length > 0 && thumbnail.length <= 8000000
        ? thumbnail.trim()
        : null;

    // Accept a client-provided playable URL: absolute http(s), or a path
    // to a file stored via POST /api/uploads. Blob/data URLs die on reload
    // or blow up the row, so they fall back to the sample video (video) or
    // NULL (audio/text) as before.
    const trimmedUrl = typeof contentUrl === 'string' ? contentUrl.trim() : '';
    const clientContentUrl =
      trimmedUrl.length > 0 &&
      trimmedUrl.length <= 2048 &&
      (/^https?:\/\/.+/i.test(trimmedUrl) || /^\/uploads\/[\w.\-]+$/i.test(trimmedUrl))
        ? trimmedUrl
        : null;

    const clientAudioDuration =
      typeof audioDuration === 'string' && audioDuration.trim().length > 0 && audioDuration.trim().length <= 20
        ? audioDuration.trim()
        : null;

    await pool.query(
      `INSERT INTO talents
         (id, title, type, category, author_name, author_handle, author_avatar,
          author_location, author_rank, is_verified, created_label,
          likes, views, comments_count, votes, description, thumbnail, content_url,
          poem_text, audio_duration, tags, audio_waveform)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0, 0, 0, ?, ?, ?, ?, ?, ?, NULL)`,
      [
        id,
        String(title).trim(),
        safeType,
        String(category).trim(),
        author.name,
        author.handle,
        author.avatar,
        author.location,
        author.rank,
        1,
        createdLabel || 'Just now',
        String(description).trim(),
        clientThumbnail || PLACEHOLDER_THUMBNAILS[safeType],
        clientContentUrl || (safeType === 'video' ? SAMPLE_VIDEO_URL : null),
        Array.isArray(poemText) ? JSON.stringify(poemText) : null,
        clientAudioDuration,
        Array.isArray(tags) ? JSON.stringify(tags) : null,
      ],
    );

    // Publishing earns +50 score, mirroring the frontend toast.
    await pool.query(
      'UPDATE users SET talent_count = talent_count + 1, score = score + 50 WHERE id = ?',
      [author.id],
    );

    const [rows] = await pool.query('SELECT * FROM talents WHERE id = ? LIMIT 1', [id]);
    const [updated] = await pool.query('SELECT * FROM users WHERE id = ? LIMIT 1', [author.id]);
    return res.status(201).json({ talent: mapTalent(rows[0]), user: mapUserPublic(updated[0]) });
  } catch (err) {
    console.error('[create-talent]', err.message);
    return res.status(500).json({ error: 'Could not publish talent. Please try again.' });
  }
}

/**
 * Toggle like / vote / save for the authenticated user on a talent.
 * action must be one of 'like' | 'vote' | 'save'.
 */
async function toggleInteraction(req, res, action) {
  const { id } = req.params;
  const col = { like: 'liked', vote: 'voted', save: 'saved' }[action];
  const countCol = { like: 'likes', vote: 'votes', save: null }[action];

  try {
    const [talents] = await pool.query(
      'SELECT id, likes, votes, author_name, author_handle FROM talents WHERE id = ? LIMIT 1',
      [id],
    );
    if (talents.length === 0) {
      return res.status(404).json({ error: 'Talent not found' });
    }

    const [actors] = await pool.query('SELECT handle, name FROM users WHERE id = ? LIMIT 1', [
      req.userId,
    ]);
    const actor = actors[0];
    // Anti-gaming: liking/voting your own post still toggles your state,
    // but it does NOT move the counter (which feeds the leaderboard).
    const isSelf =
      actor &&
      (actor.handle === talents[0].author_handle || actor.name === talents[0].author_name);

    const current = await getInteractions(req.userId, [id]);
    const prev = current.get(id)?.[col] ? 1 : 0;
    const next = prev ? 0 : 1;

    await pool.query(
      `INSERT INTO content_interactions (user_id, talent_id, ${col})
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE ${col} = VALUES(${col})`,
      [req.userId, id, next],
    );

    if (countCol && !isSelf) {
      const delta = next - prev;
      await pool.query(
        `UPDATE talents SET ${countCol} = GREATEST(0, ${countCol} + ?) WHERE id = ?`,
        [delta, id],
      );
    }

    const [rows] = await pool.query('SELECT * FROM talents WHERE id = ? LIMIT 1', [id]);
    const decorated = await decorateWithInteractions([mapTalent(rows[0])], req.userId);
    return res.json({
      talent: decorated[0],
      action,
      active: next === 1,
    });
  } catch (err) {
    console.error(`[toggle-${action}]`, err.message);
    return res.status(500).json({ error: `Could not ${action} this talent` });
  }
}

export function toggleLike(req, res) {
  return toggleInteraction(req, res, 'like');
}

export function toggleVote(req, res) {
  return toggleInteraction(req, res, 'vote');
}

export function toggleSave(req, res) {
  return toggleInteraction(req, res, 'save');
}
