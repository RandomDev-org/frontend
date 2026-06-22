import { api } from './api';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

const TOKEN_KEY = 'musicspot_token';
const USER_KEY = 'musicspot_user';

export const authService = {
  async register(data: { email: string; password: string; name: string }) {
    const res = await api.post<AuthResponse>('/auth/register', data);
    this.setSession(res);
    return res;
  },

  async login(data: { email: string; password: string }) {
    const res = await api.post<AuthResponse>('/auth/login', data);
    this.setSession(res);
    return res;
  },

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  setSession(res: AuthResponse) {
    localStorage.setItem(TOKEN_KEY, res.token);
    localStorage.setItem(USER_KEY, JSON.stringify(res.user));
  },

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  getUser(): AuthUser | null {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as AuthUser;
    } catch {
      return null;
    }
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};
