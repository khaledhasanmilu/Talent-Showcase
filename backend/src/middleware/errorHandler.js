// JSON 404 for unknown routes (must be registered after all routers).
export function notFound(_req, res) {
  res.status(404).json({ error: 'Route not found' });
}

// Generic fallback error handler (must be registered last).
export function errorHandler(err, _req, res, _next) {
  console.error('[api]', err);
  res.status(500).json({ error: 'Something went wrong. Please try again.' });
}
