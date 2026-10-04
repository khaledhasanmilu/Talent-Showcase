import type { ChatThread, Comment, LeaderboardUser, NotificationItem, TalentItem, UserProfile } from '../types';


const API_BASE_URL = (import.meta.env.VITE_API_URL as string | undefined) || '';

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
    return data;
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const data = await request<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setToken(data.token);
    return data;
  },

  async me(): Promise<UserProfile> {
    const data = await request<{ user: UserProfile }>('/api/auth/me');
    return data.user;
  },

  async getTalents(params?: { type?: string; category?: string; search?: string }): Promise<TalentItem[]> {
    const query = new URLSearchParams();
    if (params?.type) query.set('type', params.type);
    if (params?.category) query.set('category', params.category);
    if (params?.search) query.set('search', params.search);
    const suffix = query.toString() ? `?${query.toString()}` : '';
    const data = await request<{ talents: TalentItem[] }>(`/api/talents${suffix}`);
    return data.talents;
  },

  async getLeaderboard(limit = 8): Promise<LeaderboardUser[]> {
    const data = await request<{ leaderboard: LeaderboardUser[] }>(`/api/leaderboard?limit=${limit}`);
    return data.leaderboard;
  },

  async createTalent(payload: CreateTalentPayload): Promise<{ talent: TalentItem; user: UserProfile }> {
    return request<{ talent: TalentItem; user: UserProfile }>('/api/talents', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  // ---- Interactions (like / vote / save) ----
  async toggleTalentInteraction(talentId: string, action: 'like' | 'vote' | 'save'): Promise<{ talent: TalentItem; active: boolean }> {
    return request<{ talent: TalentItem; active: boolean }>(`/api/talents/${talentId}/${action}`, {
      method: 'POST',
    });
  },

  // ---- Comments ----
  async getComments(talentId: string): Promise<Comment[]> {
    const data = await request<{ comments: Comment[] }>(`/api/talents/${talentId}/comments`);
    return data.comments;
  },

  async addComment(talentId: string, text: string): Promise<Comment> {
    const data = await request<{ comment: Comment }>(`/api/talents/${talentId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
    return data.comment;
  },

  async toggleCommentLike(commentId: string): Promise<{ comment: Comment; active: boolean }> {
    return request<{ comment: Comment; active: boolean }>(`/api/comments/${commentId}/like`, {
      method: 'POST',
    });
  },

  // ---- Profile ----
  async updateProfile(payload: { name?: string; handle?: string; location?: string; bio?: string; avatar?: string }): Promise<UserProfile> {
    const data = await request<{ user: UserProfile }>('/api/auth/me', {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
    return data.user;
  },

  // ---- Messaging ----
  async getUsers(search?: string): Promise<UserProfile[]> {
    const suffix = search ? `?search=${encodeURIComponent(search)}` : '';
    const data = await request<{ users: UserProfile[] }>(`/api/users${suffix}`);
    return data.users;
  },

  async getConversations(): Promise<ChatThread[]> {
    const data = await request<{ conversations: ChatThread[] }>('/api/conversations');
    return data.conversations;
  },

  async createConversation(contactId: string): Promise<ChatThread> {
    const data = await request<{ conversation: ChatThread }>('/api/conversations', {
      method: 'POST',
      body: JSON.stringify({ contactId }),
    });
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
    return data.notifications;
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
