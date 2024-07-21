import { ObjectId } from 'mongodb';
import type { UpdateFilter } from 'mongodb';

import type { User } from '../types/database/user.js';
import type { Database } from '../types/database/database.js';

export function getUser(email: string, db: Database) {
  return db.users.findOne({ email });
}

export function getUserById(id: string, db: Database) {
  return db.users.findOne({ _id: new ObjectId(id) });
}

export function createUser(email: string, password: string, db: Database) {
  return db.users.insertOne({
    email,
    password,
  });
}

export function updateUser(userId: string, db: Database, data: UpdateFilter<User>) {
  return db.users.updateOne({ _id: new ObjectId(userId) }, data);
}
