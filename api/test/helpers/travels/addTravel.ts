import * as assert from 'assert';
import { default as axios } from 'axios';
import { randomTravel } from './randomTravel';
import { createAuthOptions } from '../../setup/axios';

axios.defaults.baseURL = 'http://localhost:3000';

export async function addTravel(userId: string, auth: any, travel?: any) {
  const data = travel ?? randomTravel();
  const response = await axios.post(`user/${userId}/travels`, data, auth);

  assert.equal(response.status, 201);

  return response.data;
}
