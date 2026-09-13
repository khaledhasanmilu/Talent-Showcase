import type { LeaderboardUser, TalentItem, UserProfile } from '../types';


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

  logout() {
    clearToken();
  },
};
