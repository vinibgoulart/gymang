import mongoose from 'mongoose';

import { restartCounters } from './counters';

export async function clearDatabase() {
  if (mongoose.connection.db) {
    await mongoose.connection.db.dropDatabase();
  }
}

export async function clearDbAndRestartCounters() {
  await clearDatabase();
  restartCounters();
}
