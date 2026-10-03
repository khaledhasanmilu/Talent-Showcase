// Row → API shape mappers (MySQL snake_case → frontend camelCase).

function parseJson(value, fallback) {
  if (value === null || value === undefined) return fallback;
  if (typeof value !== 'string') return value;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

export function mapTalent(row, interaction = {}) {
  return {
    id: row.id,
    title: row.title,
    type: row.type,
    category: row.category,
    authorName: row.author_name,
    authorHandle: row.author_handle,
    authorAvatar: row.author_avatar,
    authorLocation: row.author_location ?? undefined,
    authorRank: row.author_rank ?? undefined,
    isVerified: Boolean(row.is_verified),
    createdAt: row.created_label ?? '',
    likes: row.likes,
    views: row.views,
    commentsCount: row.comments_count,
    votes: row.votes,
    description: row.description ?? '',
    thumbnail: row.thumbnail ?? '',
    contentUrl: row.content_url ?? undefined,
    poemText: parseJson(row.poem_text, undefined),
    audioDuration: row.audio_duration ?? undefined,
    tags: parseJson(row.tags, undefined),
    audioWaveform: parseJson(row.audio_waveform, undefined),
    isLiked: Boolean(interaction.liked),
    isVoted: Boolean(interaction.voted),
    isSaved: Boolean(interaction.saved),
  };
}

export function mapUserPublic(row) {
  return {
    id: row.id,
    name: row.name,
    handle: row.handle,
    avatar: row.avatar,
    location: row.location ?? '',
    bio: row.bio ?? '',
    talentCount: row.talent_count,
    score: row.score,
    rank: row.rank,
    email: row.email,
    role: row.role,
    category: row.category ?? undefined,
  };
}

export function buildHandle(name) {
  const base = String(name || 'user').toLowerCase().replace(/[^a-z0-9]+/g, '');
  return `@${base || 'user'}`;
}

export function relativeTime(dateStr) {
  if (!dateStr) return 'Just now';
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return 'Just now';
  const diffSec = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diffSec < 60) return 'Just now';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 7) return `${diffDay}d ago`;
  return date.toISOString().slice(0, 10);
}

export function mapComment(row, isLiked = false) {
  return {
    id: row.id,
    talentId: row.talent_id,
    authorName: row.author_name,
    authorAvatar: row.author_avatar,
    text: row.text,
    likes: row.likes,
    isLiked: Boolean(isLiked),
    replies: [],
    createdAt: relativeTime(row.created_at),
  };
}
