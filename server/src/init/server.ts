import path from 'path';

import express from 'express';

import type { Database } from '../types/database/database.js';
import { attachAuth } from '../middlewares/auth.js';
import { attachUpdateUser } from '../controllers/user.update.js';
import { attachGetUser } from '../controllers/user.get.js';
import { attachRegister } from '../controllers/register.js';
import { attachLogin } from '../controllers/login.js';

export function createServer(port: number, database: Database) {
  const server = express();

  server.locals.database = database;

  server.use(express.json());
  server.use(express.urlencoded({ extended: true }));

  console.log(path.join(import.meta.url, '../uploads'));
  server.use('/avatars', express.static(path.join(import.meta.url, '../uploads')));

  attachAuth(server);

  attachGetUser(server);
  attachRegister(server);
  attachLogin(server);
  attachUpdateUser(server);

  return {
    server,
    startServer: () =>
      server.listen(port, () => console.log(`Server running on http://localhost:${port}`)),
  };
}
