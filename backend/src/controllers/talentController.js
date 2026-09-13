import { pool } from '../config/db.js';
import { mapTalent, mapUserPublic } from '../utils/mappers.js';

const SAMPLE_VIDEO_URL =
  'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/friday.mp4';

const PLACEHOLDER_THUMBNAILS = {
  video: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop&q=80',
  audio: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
  text: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&auto=format&fit=crop&q=80',
};

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
    return res.json({ talents: rows.map(mapTalent) });
  } catch (err) {
    console.error('[talents]', err.message);
    return res.status(500).json({ error: 'Could not load talents' });
  }
}

// POST /api/talents (auth required — author is taken from the JWT)
export async function createTalent(req, res) {
  const { title, type, category, description, poemText, tags, createdLabel } = req.body || {};

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

    await pool.query(
      `INSERT INTO talents
         (id, title, type, category, author_name, author_handle, author_avatar,
          author_location, author_rank, is_verified, created_label,
          likes, views, comments_count, votes, description, thumbnail, content_url,
          poem_text, audio_duration, tags, audio_waveform)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0, 0, 0, ?, ?, ?, ?, NULL, ?, NULL)`,
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
        PLACEHOLDER_THUMBNAILS[safeType],
        safeType === 'video' ? SAMPLE_VIDEO_URL : null,
        Array.isArray(poemText) ? JSON.stringify(poemText) : null,
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
