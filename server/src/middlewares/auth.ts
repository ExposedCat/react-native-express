import type { Express } from 'express';

import { decodeToken, verifyToken } from '../services/jwt.js';

export function attachAuth(server: Express) {
  server.use((req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
      req.userId = null;
    } else {
      const isValid = verifyToken(token);
      if (!isValid) {
        req.userId = null;
      } else {
        const data = decodeToken(token);
        req.userId = data?.userId ?? null;
      }
    }
    return next();
  });
}
