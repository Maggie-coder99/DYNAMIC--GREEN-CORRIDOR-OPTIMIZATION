const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

export function apiUrl(path) {
  return `${API_BASE}${path}`;
}

export async function api(path, { method = 'GET', body, token } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  let res;
  try {
    res = await fetch(apiUrl(path), {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    const error = new Error(
      'Cannot reach the API. Use npm run dev locally, or confirm /api is routed to the Express function on the host.',
    );
    error.code = 'BACKEND_UNAVAILABLE';
    throw error;
  }

  const contentType = res.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    const error = new Error(
      'The API did not return JSON. On Vercel, /api must rewrite to api/index.js — not index.html.',
    );
    error.code = 'BACKEND_UNAVAILABLE';
    error.status = res.status;
    throw error;
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status === 401 && !path.includes('/api/auth/login') && typeof window !== 'undefined') {
      window.dispatchEvent(new Event('pulse-auth-expired'));
    }
    const error = new Error(
      data.error || `Request failed (HTTP ${res.status}). Try operator@corridor.demo / demo123.`,
    );
    error.code = data.code;
    error.status = res.status;
    throw error;
  }
  return data;
}
