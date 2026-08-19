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
    const error = new Error('Backend unavailable. Start the API on port 4000.');
    error.code = 'BACKEND_UNAVAILABLE';
    throw error;
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const error = new Error(data.error || 'Request failed');
    error.code = data.code;
    error.status = res.status;
    throw error;
  }
  return data;
}
