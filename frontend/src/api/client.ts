import type { ChatThread, Comment, LeaderboardUser, NotificationItem, TalentItem, UserProfile } from '../types';


const API_BASE_URL = (import.meta.env.VITE_API_URL as string | undefined) || '';

/**
 * Turn a stored media path into a playable URL.
 * Backend stores `/uploads/<file>`; in dev the Vite proxy only forwards
 * `/api`, so relative upload paths must be resolved against the API origin.
 * Absolute http(s) URLs (old sample/placeholder data) pass through untouched.
 */
export function resolveMediaUrl(url: string | undefined): string | undefined {
  if (!url) return undefined;
  if (/^https?:\/\//i.test(url) || url.startsWith('blob:') || url.startsWith('data:')) return url;
  const base = API_BASE_URL || (typeof window !== 'undefined' ? window.location.origin : '');
  return `${base.replace(/\/$/, '')}${url.startsWith('/') ? url : `/${url}`}`;
}

/**
 * Backend stores uploaded files as `/uploads/<file>` paths. Resolve every
 * avatar/thumbnail/content URL in API responses once, here, so all views
 * (navbar, cards, inbox, comments, leaderboard…) work without per-file edits.
 * Idempotent — absolute http(s)/blob/data URLs pass through untouched.
 */
function resolveUserMedia<T extends { avatar?: string | null }>(u: T): T {
  const avatar = resolveMediaUrl(u.avatar ?? undefined);
  return avatar === undefined ? u : { ...u, avatar };
}

function resolveTalentMedia(t: TalentItem): TalentItem {
  return {
    ...t,
    authorAvatar: resolveMediaUrl(t.authorAvatar) ?? t.authorAvatar,
    thumbnail: resolveMediaUrl(t.thumbnail) ?? t.thumbnail,
    contentUrl: resolveMediaUrl(t.contentUrl) ?? t.contentUrl,
  };
}

const TOKEN_KEY = 'ts_token';

export function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

function setToken(token: string) {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {
    
  }
}

export function clearToken() {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    // ignore
  }
}

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string> | undefined) || {}),
  };
  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
  const data = (await res.json().catch(() => ({}))) as { error?: string } & T;

  if (!res.ok) {
    throw new ApiError(res.status, data?.error || `Request failed (${res.status})`);
  }
  return data;
}

export interface AuthResponse {
  token: string;
  user: UserProfile;
}

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  avatar?: string;
  role?: 'creator' | 'audience';
  category?: string;
}

export interface CreateTalentPayload {
  title: string;
  type: 'audio' | 'video' | 'text';
  category: string;
  description: string;
  poemText?: string[];
  tags?: string[];
  createdLabel?: string;
  /** JPEG data URL of a frame captured from the uploaded video file. */
  thumbnail?: string;
  /** Playable http(s) URL for the content (blob:/data: URLs are rejected server-side). */
  contentUrl?: string;
  /** Real playback duration of the uploaded audio file ("m:ss"). */
  audioDuration?: string;
}

export const api = {
  isConfigured: () => true,

  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const data = await request<AuthResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    setToken(data.token);
    data.user = resolveUserMedia(data.user);
    return data;
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const data = await request<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setToken(data.token);
    data.user = resolveUserMedia(data.user);
    return data;
  },

  async me(): Promise<UserProfile> {
    const data = await request<{ user: UserProfile }>('/api/auth/me');
    return resolveUserMedia(data.user);
  },

  async getTalents(params?: { type?: string; category?: string; search?: string }): Promise<TalentItem[]> {
    const query = new URLSearchParams();
    if (params?.type) query.set('type', params.type);
    if (params?.category) query.set('category', params.category);
    if (params?.search) query.set('search', params.search);
    const suffix = query.toString() ? `?${query.toString()}` : '';
    const data = await request<{ talents: TalentItem[] }>(`/api/talents${suffix}`);
    return data.talents.map(resolveTalentMedia);
  },

  async getLeaderboard(limit = 8, range: 'week' | 'month' | 'all' = 'all'): Promise<LeaderboardUser[]> {
    const data = await request<{ leaderboard: LeaderboardUser[] }>(`/api/leaderboard?limit=${limit}&range=${range}`);
    return data.leaderboard.map(resolveUserMedia);
  },

  async createTalent(payload: CreateTalentPayload): Promise<{ talent: TalentItem; user: UserProfile }> {
    const data = await request<{ talent: TalentItem; user: UserProfile }>('/api/talents', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    data.talent = resolveTalentMedia(data.talent);
    data.user = resolveUserMedia(data.user);
    return data;
  },

  /** Upload a video/audio file; returns the persistent URL to send as contentUrl. */
  async uploadFile(file: File): Promise<{ url: string; mimeType: string; size: number }> {
    const token = getToken();
    const form = new FormData();
    form.append('file', file);
    const res = await fetch(`${API_BASE_URL}/api/uploads`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: form,
    });
    const data = (await res.json().catch(() => ({}))) as { error?: string } & {
      url: string;
      mimeType: string;
      size: number;
    };
    if (!res.ok) {
      throw new ApiError(res.status, data?.error || `Upload failed (${res.status})`);
    }
    return data;
  },

  // ---- Interactions (like / vote / save) ----
  async toggleTalentInteraction(talentId: string, action: 'like' | 'vote' | 'save'): Promise<{ talent: TalentItem; active: boolean }> {
    const data = await request<{ talent: TalentItem; active: boolean }>(`/api/talents/${talentId}/${action}`, {
      method: 'POST',
    });
    data.talent = resolveTalentMedia(data.talent);
    return data;
  },

  // ---- Comments ----
  async getComments(talentId: string): Promise<Comment[]> {
    const data = await request<{ comments: Comment[] }>(`/api/talents/${talentId}/comments`);
    return data.comments.map((c) => ({
      ...c,
      authorAvatar: resolveMediaUrl(c.authorAvatar) ?? c.authorAvatar,
      replies: c.replies?.map((r) => ({ ...r, authorAvatar: resolveMediaUrl(r.authorAvatar) ?? r.authorAvatar })),
    }));
  },

  async addComment(talentId: string, text: string): Promise<Comment> {
    const data = await request<{ comment: Comment }>(`/api/talents/${talentId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
    data.comment.authorAvatar = resolveMediaUrl(data.comment.authorAvatar) ?? data.comment.authorAvatar;
    return data.comment;
  },

  async toggleCommentLike(commentId: string): Promise<{ comment: Comment; active: boolean }> {
    const data = await request<{ comment: Comment; active: boolean }>(`/api/comments/${commentId}/like`, {
      method: 'POST',
    });
    data.comment.authorAvatar = resolveMediaUrl(data.comment.authorAvatar) ?? data.comment.authorAvatar;
    return data;
  },

  // ---- Profile ----
  async updateProfile(payload: { name?: string; handle?: string; location?: string; bio?: string; avatar?: string }): Promise<UserProfile> {
    const data = await request<{ user: UserProfile }>('/api/auth/me', {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
    return resolveUserMedia(data.user);
  },

  // ---- Messaging ----
  async getUsers(search?: string): Promise<UserProfile[]> {
    const suffix = search ? `?search=${encodeURIComponent(search)}` : '';
    const data = await request<{ users: UserProfile[] }>(`/api/users${suffix}`);
    return data.users.map(resolveUserMedia);
  },

  async getConversations(): Promise<ChatThread[]> {
    const data = await request<{ conversations: ChatThread[] }>('/api/conversations');
    return data.conversations.map((th) => ({
      ...th,
      contact: { ...th.contact, avatar: resolveMediaUrl(th.contact.avatar) ?? th.contact.avatar },
    }));
  },

  async createConversation(contactId: string): Promise<ChatThread> {
    const data = await request<{ conversation: ChatThread }>('/api/conversations', {
      method: 'POST',
      body: JSON.stringify({ contactId }),
    });
    data.conversation.contact.avatar =
      resolveMediaUrl(data.conversation.contact.avatar) ?? data.conversation.contact.avatar;
    return data.conversation;
  },

  async sendMessage(threadId: string, text: string): Promise<{ userMessage: ChatThread['messages'][number]; lastMessage: string }> {
    return request<{ userMessage: ChatThread['messages'][number]; lastMessage: string }>(`/api/conversations/${threadId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
  },

  // ---- Notifications ----
  async getNotifications(): Promise<NotificationItem[]> {
    const data = await request<{ notifications: NotificationItem[] }>('/api/notifications');
    return data.notifications.map((n) => ({
      ...n,
      user: { ...n.user, avatar: resolveMediaUrl(n.user.avatar) ?? n.user.avatar },
    }));
  },

  async markAllNotificationsRead(): Promise<void> {
    await request<{ ok: boolean }>('/api/notifications/read', { method: 'POST' });
  },

  async markNotificationRead(id: string): Promise<void> {
    await request<{ ok: boolean }>(`/api/notifications/${id}/read`, { method: 'POST' });
  },

  logout() {
    clearToken();
  },
};
