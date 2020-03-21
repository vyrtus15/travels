import { default as axios } from 'axios';
import { TestUser, TestUserType, UserTestContext } from '../../helpers/interfaces';
import { loginAsNewAdmin, loginAsNewManager, loginAsNewUser } from '../../helpers/user';
import { extendedUserTestContext } from '../../helpers/user/context';
import { registerUser } from '../../helpers/user/registerUser';
import { createTestContext, destroyTestContext } from '../../setup';
import { createAuthOptions } from '../../setup/axios';
import { RoleType } from '../../../src/common/roleType';

describe('/user (e2e)', () => {
  let user: TestUser;
  let moderator: TestUser;
  let admin: TestUser;
  let userInRole: UserTestContext;

  beforeAll(async () => {
    await createTestContext();

    userInRole = await extendedUserTestContext();

    user = userInRole[TestUserType.asUser];
    moderator = userInRole[TestUserType.asManager];
    admin = userInRole[TestUserType.asAdmin];

  }, 60000);

  afterAll(async () => {
    await destroyTestContext();
  });

  describe('/ (GET)', () => {
    beforeAll(async () => {
      // ensure there are enough users to search
      for (let i = 0; i < 10; i++) {
        await registerUser();
      }
    }, 60000);

    it('should be forbidden for `user` roles', async () => {
      const response = await axios.get('user', createAuthOptions(user));
      expect(response.status).toBe(403);
    });

    it.each([
      TestUserType.asManager,
      TestUserType.asAdmin,
    ])('should respond with 200 for %s', async (role) => {
      const response = await axios.get('user', createAuthOptions(userInRole[role]));
      expect(response.status).toBe(200);
    });

    it('should not return admin and moderator accounts for a moderator', async () => {
      // There should be at least one admin and one moderator created in the `beforeAll` hook above
      // none of which should be visible by the moderator
      const response = await axios.get(`user?limit=100`, createAuthOptions(moderator));

      const usr = response.data.items.map(u => u.roles)
      const onlyUsers = usr.every(roles => roles.length === 1 && roles[0] === RoleType.user);

      expect(response.status).toBe(200);
      expect(onlyUsers).toBe(true);
    });

    it('should return all type of accounts for an admin', async () => {
      const response = await axios.get(`user`, createAuthOptions(admin));

      expect(response.status).toBe(200);
      expect(response.data?.items?.length).toBeGreaterThanOrEqual(3);
    });

    it('should respond with paginated result', async () => {
      const response = await axios.get('user?page=2&limit=3', createAuthOptions(admin));

      expect(response.status).toBe(200);
      expect(response.data?.page).toBe(2);
      expect(response.data?.limit).toBe(3);
      expect(response.data?.total).toBeGreaterThan(10);
      expect(response.data?.items?.length).toBe(3);
    });

  });

  describe('/me (GET)', () => {
    it('should return own user', async () => {
      const response = await axios.get('user/me', createAuthOptions(user));
      expect(response.status).toBe(200);

      expect(response.data.userName).toBe(user.userName);
    });

    it('should require authorization', async () => {
      const response = await axios.get('user/me');
      expect(response.status).toBe(401);
    });
  });

  describe('/:userId (PUT)', () => {
    it.each([
      'firstName',
      'lastName',
    ])('should validate empty `$s`', async (field) => {
      const newData = { firstName: 'John', lastName: 'Doe' };
      newData[field] = '';

      const response = await axios.put(`user/${user.id}`, newData, createAuthOptions(user));
      expect(response.status).toBe(400);
    });

    it.each([
      TestUserType.asUser,
      TestUserType.asManager,
      TestUserType.asAdmin,
    ])('should update own profile data (as %s)', async (role) => {
      const newData = { firstName: 'John', lastName: 'Doe' };
      let response = await axios.put(`user/${userInRole[role].id}`, newData, createAuthOptions(userInRole[role]));
      expect(response.status).toBe(200);

      response = await axios.get('user/me', createAuthOptions(userInRole[role]));
      expect(response.status).toBe(200);
      expect(response.data).toMatchObject(newData);
    });

    it.each([
      [TestUserType.asUser, TestUserType.asAnotherUser],
      [TestUserType.asUser, TestUserType.asManager],
      [TestUserType.asUser, TestUserType.asAdmin],
      [TestUserType.asManager, TestUserType.asAnotherManager],
      [TestUserType.asManager, TestUserType.asAdmin],
    ])('should forbid a %s to update %s', async (roleA, roleB) => {
      const newData = { firstName: 'John', lastName: 'Doe' };
      const response = await axios.put(`user/${userInRole[roleB].id}`, newData, createAuthOptions(userInRole[roleA]));
      expect(response.status).toBe(403);
    });

    it.each([
      [TestUserType.asManager, TestUserType.asUser],
      [TestUserType.asAdmin, TestUserType.asUser],
      [TestUserType.asAdmin, TestUserType.asManager],
      [TestUserType.asAdmin, TestUserType.asAdmin],
    ])('should allow a %s to update %s', async (roleA, roleB) => {
      const newData = { firstName: 'John', lastName: 'Doe' };
      const response = await axios.put(`user/${userInRole[roleB].id}`, newData, createAuthOptions(userInRole[roleA]));
      expect(response.status).toBe(200);
    });
  });

  describe('/:userId (Delete)', () => {
    it.each([
      TestUserType.asUser,
      TestUserType.asManager,
      TestUserType.asAdmin,
    ])('should allow to delete own user account (as %s)', async (role) => {
      let newUser: TestUser;

      switch (role) {
        case TestUserType.asUser:
          newUser = await loginAsNewUser();
          break;
        case TestUserType.asManager:
          newUser = await loginAsNewManager();
          break;
        case TestUserType.asAdmin:
          newUser = await loginAsNewAdmin();
          break;
        default:
          throw new Error('A new unsupported role has been added to the test.');
      }

      let response = await axios.delete(`user/${newUser.id}`, createAuthOptions(newUser));
      expect(response.status).toBe(204);

      response = await axios.get(`user/${newUser.id}`, createAuthOptions(admin));
      expect(response.status).toBe(404);
    });

    it.each([
      [TestUserType.asUser, TestUserType.asAnotherUser],
      [TestUserType.asUser, TestUserType.asManager],
      [TestUserType.asUser, TestUserType.asAdmin],
      [TestUserType.asManager, TestUserType.asAnotherManager],
      [TestUserType.asManager, TestUserType.asAdmin],
    ])('should forbid a %s to delete %s', async (roleA, roleB) => {
      const response = await axios.delete(`user/${userInRole[roleB].id}`, createAuthOptions(userInRole[roleA]));
      expect(response.status).toBe(403);
    });

    it.each([
      [TestUserType.asManager, TestUserType.asUser],
      [TestUserType.asAdmin, TestUserType.asAnotherUser], // we use `anotherUser` as `user` might already be deleted by moderator
      [TestUserType.asAdmin, TestUserType.asManager],
      [TestUserType.asAdmin, TestUserType.asAnotherAdmin],
    ])('should allow a %s to delete %s', async (roleA, roleB) => {
      const response = await axios.delete(`user/${userInRole[roleB].id}`, createAuthOptions(userInRole[roleA]));
      expect(response.status).toBe(204);
    });
  });
});
