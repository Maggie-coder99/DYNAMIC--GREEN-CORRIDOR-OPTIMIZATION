const API_BASE = import.meta.env.VITE_API_URL ?? '';

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
      'Cannot reach the API. Run npm run dev in the project root, then open http://localhost:5173.',
    );
    error.code = 'BACKEND_UNAVAILABLE';
    throw error;
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const error = new Error(
      data.error || `Request failed (HTTP ${res.status}). Try operator@corridor.demo / demo123.`,
    );
    error.code = data.code;
    error.status = res.status;
    throw error;
  }
  return data;
}
