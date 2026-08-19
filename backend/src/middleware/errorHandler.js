export function errorHandler(err, req, res, _next) {
  const status = err.status || 500;
  const message =
    status >= 500 ? 'Something went wrong. Please retry or check server logs.' : err.message;
  if (status >= 500) {
    console.error(err);
  }
  res.status(status).json({
    error: message,
    code: err.code || 'INTERNAL_ERROR',
  });
}

export function notFound(req, res) {
  res.status(404).json({ error: 'Not found', code: 'NOT_FOUND' });
}
