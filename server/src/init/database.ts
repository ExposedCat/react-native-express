import { MongoClient } from 'mongodb';

import type { Database } from '../types/database/database.js';

export function createDatabase() {
  const url = 'mongodb://127.0.0.1:27017';
  const client = new MongoClient(url);

  const dbName = 'fitty';

  return {
    client,
    connectToDb: async (): Promise<Database> => {
      console.log('Connecting to the database...');
      await client.connect();
      console.log('Done');
      const db = client.db(dbName);
      return {
        users: db.collection('users'),
      };
    },
  };
}
