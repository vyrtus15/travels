import { setupAxios } from './axios';
import { connectMongo, disconnectMongo } from './mongo';

export async function createTestContext() {
  setupAxios();
  await connectMongo();
}

export async function destroyTestContext() {
  await disconnectMongo();
}
