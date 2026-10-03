import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

// Optional auth: if a valid Bearer token is present, sets req.userId.
// Otherwise continues as anonymous. Used to decorate public reads.
export function authOptional(req, _res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');
  if (scheme === 'Bearer' && token) {
    try {
      req.userId = jwt.verify(token, env.jwtSecret).sub;
    } catch {
      // ignore invalid token — treat as anonymous
    }
  }
  return next();
}