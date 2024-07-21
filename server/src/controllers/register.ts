import type { Express } from 'express';

import type { TypedRequest } from '../types/server.js';
import { getUser, createUser } from '../services/user.js';

export function attachRegister(server: Express) {
  server.post(
    '/register',

    async (req: TypedRequest<{ email: string; password: string; name: string }, null>, res) => {
      const { email, password, name } = req.body;
      if (!email || !password || !name) {
        return res.status(200).json({ ok: false, message: 'Invalid input', data: null });
      }

      const user = await getUser(req.body.email.toLowerCase(), server.locals.database);
      if (user) {
        return res.status(200).json({ ok: false, message: 'User already exists', data: null });
      }

      await createUser(email, password, server.locals.database);
      return res.status(200).json({ ok: true, message: 'User registered', data: null });
    },
  );
}
