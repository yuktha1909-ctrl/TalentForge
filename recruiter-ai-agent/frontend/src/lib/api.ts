/**
 * api.ts — Typed API client for TalentForge frontend.
 *
 * Uses NEXT_PUBLIC_API_URL (set in .env.local) as the base URL.
 * Falls back to localhost:8000 in development.
 */

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') || 'http://localhost:8000';

// ──────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthToken {
  access_token: string;
  token_type: string;
  user: {
    id: number;
    email: string;
    full_name: string;
    role: 'recruiter' | 'hiring_manager' | 'admin';
    is_active: boolean;
    created_at: string;
  };
}

export interface ApiError {
  detail: string;
}

// ──────────────────────────────────────────────
// Core fetch wrapper
// ──────────────────────────────────────────────

async function request<T>(
  path: string,
  options: RequestInit = {},
  token?: string
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string> | undefined),
  };

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const errBody: ApiError = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(errBody.detail || `HTTP ${res.status}`);
  }

  return res.json() as Promise<T>;
}

// ──────────────────────────────────────────────
// Auth API
// ──────────────────────────────────────────────

/**
 * POST /api/v1/auth/login
 * Returns a JWT access token and the authenticated user profile.
 */
export async function apiLogin(payload: LoginPayload): Promise<AuthToken> {
  return request<AuthToken>('/api/v1/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

/**
 * GET /api/v1/auth/me
 * Returns the profile of the currently authenticated user.
 */
export async function apiGetMe(token: string): Promise<AuthToken['user']> {
  return request<AuthToken['user']>('/api/v1/auth/me', {}, token);
}

// ──────────────────────────────────────────────
// Health
// ──────────────────────────────────────────────

export async function apiHealthCheck(): Promise<{ status: string }> {
  return request<{ status: string }>('/');
}
