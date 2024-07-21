import type { Express } from 'express';

import type { TypedRequest } from '../types/server.js';
import type { User } from '../types/database/user.js';
import { updateUser } from '../services/user.js';

export function attachUpdateUser(server: Express) {
  server.post('/update', async (req: TypedRequest<Partial<User>, null>, res) => {
    if (!req.userId) {
      return res.status(200).json({ ok: false, message: 'User not found', data: null });
    }
    const result = await updateUser(req.userId, server.locals.database, { $set: req.body });
    if (result.matchedCount !== 1) {
      return res.status(200).json({ ok: false, message: 'User not found', data: null });
    }
    return res.status(200).json({ ok: true, message: 'User updated', data: null });
  });
}
