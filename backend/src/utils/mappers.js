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

export function mapTalent(row) {
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
    isLiked: false,
    isVoted: false,
    isSaved: false,
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
