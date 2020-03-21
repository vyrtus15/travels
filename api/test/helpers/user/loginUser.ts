import * as assert from 'assert';
import { default as axios } from 'axios';

export async function loginUser({ userName, password }: { userName: string, password: string }): Promise<string> {
  const response = await axios.post('auth/login', { userName, password });

  assert.equal(response.status, 200);
  assert.ok(response.data);
  assert.ok(response.data.accessToken);

  return response.data.accessToken;
}
