import { RoleType } from '../../../src/common/roleType';
import { updateRole } from '../../setup/mongo';
import { TestUser } from '../interfaces';
import { getUserId } from './getUserId';
import { loginUser } from './loginUser';
import { registerUser } from './registerUser';

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
