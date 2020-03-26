import * as assert from 'assert';
import { default as axios } from 'axios';
import { RoleType } from '../../../src/common/roleType';
import { createAuthOptions } from '../../setup/axios';
import { updateRole } from '../../setup/mongo';
import { TestUser } from '../interfaces';
import random = require('randomstring');

axios.defaults.baseURL = 'http://localhost:3000';
export async function registerUser(user?: any) {
  const data = user ?? randomUser();
  const response = await axios.post('auth/register', data);

  assert.equal(response.status, 201);

  return data;
}

export function randomUser() {
  return {
    userName: `${random.generate(8)}@${random.generate(8)}.com`.toLowerCase(),
    firstName: random.generate(10),
    lastName: random.generate(10),
    password: random.generate(10),
  };
}

export async function loginAsNewUser(): Promise<TestUser> {
  const user = await registerUser();

  const accessToken = await loginUser(user);
  const id = await getUserId(user);

  return {
    id,
    ...user,
    accessToken,
  };
}

export async function loginAsNewManager(): Promise<TestUser> {
  const user = await loginAsNewUser();

  await updateRole(user.id, [RoleType.user, RoleType.manager]);

  return {
    ...user,
  };
}

export async function loginAsNewAdmin(): Promise<TestUser> {
  const user = await loginAsNewUser();

  await updateRole(user.id, RoleType.all())

  return {
    ...user,
  };
}

export async function loginUser({ userName, password }: { userName: string, password: string }): Promise<string> {
  const response = await axios.post('auth/login', { userName, password });

  assert.equal(response.status, 200);
  assert.ok(response.data);
  assert.ok(response.data.accessToken);

  return response.data.accessToken;
}

export async function loginAdmin() {
  return await loginUser({
    userName: process.env.ADMIN_USERNAME,
    password: process.env.ADMIN_PASSWORD,
  });
}

export async function getUserId(user: { userName: string, password: string }): Promise<string> {
  const accessToken = await loginUser(user);
  const response = await axios.get('user/me', createAuthOptions({ accessToken }));

  assert.equal(response.status, 200);
  assert.ok(response.data);
  assert.ok(response.data.id);

  return response.data.id;
}
