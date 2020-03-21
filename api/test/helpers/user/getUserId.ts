import * as assert from 'assert';
import { default as axios } from 'axios';
import { createAuthOptions } from '../../setup/axios';
import { loginUser } from './loginUser';

export async function getUserId(user: { userName: string, password: string }): Promise<string> {
  const accessToken = await loginUser(user);
  const response = await axios.get('user/me', createAuthOptions({ accessToken }));

  assert.equal(response.status, 200);
  assert.ok(response.data);
  assert.ok(response.data.id);

  return response.data.id;
}
