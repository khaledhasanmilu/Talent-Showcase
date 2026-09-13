import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

// Requires `Authorization: Bearer <token>`, sets req.userId on success.
export function authRequired(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');
  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Missing or invalid Authorization header' });
  }
  try {
    req.userId = jwt.verify(token, env.jwtSecret).sub;
    return next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}
