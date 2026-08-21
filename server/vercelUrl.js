/** Keep Express routes on /api even if the host strips or rewrites the path. */
export function normalizeApiUrl(url = '/') {
  const raw = String(url || '/');
  const qIndex = raw.indexOf('?');
  const pathname = qIndex === -1 ? raw : raw.slice(0, qIndex);
  const query = qIndex === -1 ? '' : raw.slice(qIndex);

  if (pathname === '/api' || pathname.startsWith('/api/')) {
    if (pathname === '/api/index' || pathname === '/api/index.js') {
      return `/api${query}`;
    }
    return `${pathname}${query}`;
  }

  const suffix = pathname.startsWith('/') ? pathname : `/${pathname}`;
  if (suffix === '/' || suffix === '/index' || suffix === '/index.js') {
    return `/api${query}`;
  }
  return `/api${suffix}${query}`;
}
