import type { Express } from 'express';

import type { TypedRequest } from '../types/server.js';
import type { User } from '../types/database/user.js';
import { getUserById } from '../services/user.js';

export function attachGetUser(server: Express) {
  server.get('/user', async (req: TypedRequest<void, User>, res) => {
    if (!req.userId) {
      return res.status(200).json({ ok: false, message: 'Unauthorized', data: null });
    }

    const user = await getUserById(req.userId, server.locals.database);
    if (!user) {
      return res.status(200).json({ ok: false, message: 'User does not exist', data: null });
    }

    return res.status(200).json({ ok: true, message: 'User logged in', data: user });
  });
}
