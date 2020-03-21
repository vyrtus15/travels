import * as assert from 'assert';
import { default as axios } from 'axios';
import { randomUser } from './randomUser';

axios.defaults.baseURL = 'http://localhost:3000';

export async function registerUser(user?: any) {
  const data = user ?? randomUser();
  const response = await axios.post('auth/register', data);

  assert.equal(response.status, 201);

  return data;
}
