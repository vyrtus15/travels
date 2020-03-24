import { default as axios } from 'axios';
import { TestUser, TestUserType, UserTestContext } from '../../helpers/interfaces';
import { addTravel } from '../../helpers/travels/addTravel';
import { randomTravel } from '../../helpers/travels/randomTravel';
import { extendedUserTestContext } from '../../helpers/user/context';
import { createTestContext, destroyTestContext } from '../../setup';
import { createAuthOptions } from '../../setup/axios';

describe('/:userId/travels (e2e)', () => {
  let user: TestUser;
  let manager: TestUser;
  let admin: TestUser;
  let userInRole: UserTestContext;

  beforeAll(async () => {
    await createTestContext();

    userInRole = await extendedUserTestContext();

    user = userInRole[TestUserType.asUser];
    manager = userInRole[TestUserType.asManager];
    admin = userInRole[TestUserType.asAdmin];

  }, 60000);

  afterAll(async () => {
    await destroyTestContext();
  });

  describe('/ (GET)', () => {

    beforeAll(async () => {
      const userIds = [user.id, admin.id, userInRole[TestUserType.asAnotherUser].id];

      for (const userId of userIds) {
        for (let i = 0; i < 3; i++) {
          await addTravel(userId, createAuthOptions(admin));
        }
      }

    }, 60000);

    it('should be forbidden for `manager` roles', async () => {
      const response = await axios.get(`user/${user.id}/travels`, createAuthOptions(manager));
      expect(response.status).toBe(403);
    });

    it.each([
      TestUserType.asUser,
      TestUserType.asAdmin,
    ])('should respond with 200 for %s', async (role) => {
      const response = await axios.get(`user/${user.id}/travels`, createAuthOptions(userInRole[role]));
      expect(response.status).toBe(200);
    });

    it.each([
      [TestUserType.asUser, TestUserType.asAnotherUser],
      [TestUserType.asUser, TestUserType.asAdmin],
    ])('should forbid a %s to get %s', async (roleA, roleB) => {
      const response = await axios.get(`user/${userInRole[roleB].id}/travels`, createAuthOptions(userInRole[roleA]));
      expect(response.status).toBe(403);
    });

    it.each([
      [TestUserType.asUser],
      [TestUserType.asAdmin],
    ])('should return all travels of %s for an admin', async (role) => {
      const response = await axios.get(`user/${userInRole[role].id}/travels`, createAuthOptions(admin));

      expect(response.status).toBe(200);
      expect(response.data?.items?.length).toBeGreaterThanOrEqual(3);
    });

    it('should respond with paginated result', async () => {
      const response = await axios.get(`user/${user.id}/travels?page=2&limit=1`, createAuthOptions(admin));

      expect(response.status).toBe(200);
      expect(response.data?.page).toBe(2);
      expect(response.data?.limit).toBe(1);
      expect(response.data?.total).toBeGreaterThanOrEqual(3);
      expect(response.data?.items?.length).toBe(1);
    });

    it.each([
      `destination=one`,
      `startDate=2020-03-20T12:12:12.121Z`,
      `endDate=2020-03-20T12:12:12.121Z`,
      `startDate=2020-03-20T12:12:12.121Z&endDate=2020-03-20T12:12:12.121Z`,
      `destination=one&endDate=2020-03-20T12:12:12.121Z`,
      `destination=one&startDate=2020-03-20T12:12:12.121Z`,
      `destination=one&startDate=2020-03-20T12:12:12.121Z&endDate=2020-03-20T12:12:12.121Z`,
    ])('should support query `%s`', async (query) => {
      const response = await axios.get(`user/${user.id}/travels?${query}`, createAuthOptions(admin));

      expect(response.status).toBe(200);
    });
  });

  describe('/:id (PUT)', () => {
    let travels = {};

    beforeAll(async () => {
      travels = {
        [TestUserType.asUser]: await addTravel(user.id, createAuthOptions(admin)),
        [TestUserType.asAnotherUser]: await addTravel(userInRole[TestUserType.asAnotherUser].id, createAuthOptions(admin)),
        [TestUserType.asAdmin]: await addTravel(admin.id, createAuthOptions(admin)),
      };
    });

    it.each([
      'destination',
      'comment',
      'startDate',
      'endDate',
    ])('should validate empty `$s`', async (field) => {
      const travel = randomTravel();
      travel[field] = '';

      const response = await axios.put(`user/${user.id}/travels/${travels[TestUserType.asUser].id}`, travel, createAuthOptions(user));
      expect(response.status).toBe(400);
    });

    it.each([
      TestUserType.asUser,
      TestUserType.asAdmin,
    ])('should update own travel (as %s)', async (role) => {
      const updatedData = { destination: 'lorem' };

      const response = await axios.put(
        `user/${userInRole[role].id}/travels/${travels[role].id}`,
        updatedData,
        createAuthOptions(userInRole[role])
      );

      expect(response.status).toBe(200);
      expect(response.data).toMatchObject(updatedData);
    });

    it.each([
      [TestUserType.asUser, TestUserType.asAnotherUser],
      [TestUserType.asUser, TestUserType.asAdmin],
    ])('should forbid a %s to update %s', async (roleA, roleB) => {
      const updatedData = { destination: 'lorem' };

      const response = await axios.put(
        `user/${userInRole[roleB].id}/travels/${travels[roleB].id}`,
        updatedData,
        createAuthOptions(userInRole[roleA])
      );

      expect(response.status).toBe(403);
    });

    it.each([
      [TestUserType.asAdmin, TestUserType.asUser],
      [TestUserType.asAdmin, TestUserType.asAdmin],
    ])('should allow a %s to update %s', async (roleA, roleB) => {
      const updatedData = { destination: 'lorem' };

      const response = await axios.put(
        `user/${userInRole[roleB].id}/travels/${travels[roleB].id}`,
        updatedData,
        createAuthOptions(userInRole[roleA])
      );

      expect(response.status).toBe(200);
    });
  });

  describe('/ (POST)', () => {
    it.each([
      ['destination', null],
      ['startDate', '2042'],
      ['endDate', '2042'],
    ])('should validate when %s is %s', async (field, value) => {
      const data = randomTravel();
      data[field] = value;

      const response = await axios.post(`user/${user.id}/travels`, data, createAuthOptions(user));

      expect(response.status).toBe(400);
    });

    it.each([
      [TestUserType.asUser, TestUserType.asUser],
      [TestUserType.asAdmin, TestUserType.asAdmin],
      [TestUserType.asAdmin, TestUserType.asUser],
    ])('should allow a %s to add travel for $s', async (roleA, roleB) => {
      const response = await axios.post(`user/${userInRole[roleB].id}/travels`, randomTravel(), createAuthOptions(userInRole[roleA]));
      expect(response.status).toBe(201);
    });

    it.each([
      [TestUserType.asUser, TestUserType.asAnotherUser],
      [TestUserType.asUser, TestUserType.asAdmin],
    ])('should forbid a %s to add travel for %s', async (roleA, roleB) => {
      const response = await axios.post(`user/${userInRole[roleB].id}/travels`, randomTravel(), createAuthOptions(userInRole[roleA]));
      expect(response.status).toBe(403);
    });
  });

  describe('/:id (DELETE)', () => {
    it.each([
      TestUserType.asUser,
      TestUserType.asAdmin,
    ])('should allow to delete own user travel (as %s)', async (role) => {
      const targetUser: TestUser = userInRole[role];
      const travel = await addTravel(targetUser.id, createAuthOptions(targetUser));

      let response = await axios.get(`user/${targetUser.id}/travels`, createAuthOptions(targetUser));
      const travelsCount = response.data.total;

      response = await axios.delete(`user/${targetUser.id}/travels/${travel.id}`, createAuthOptions(targetUser));
      expect(response.status).toBe(204);

      response = await axios.get(`user/${targetUser.id}/travels`, createAuthOptions(targetUser));
      expect(response.status).toBe(200);
      expect(response.data.total).toEqual(travelsCount - 1);
    });

    it.each([
      [TestUserType.asUser, TestUserType.asAnotherUser],
      [TestUserType.asUser, TestUserType.asAdmin],
    ])('should forbid a %s to delete %s travels', async (roleA, roleB) => {
      const travel = await addTravel(userInRole[roleB].id, createAuthOptions(userInRole[roleB]));

      const response = await axios.delete(`user/${userInRole[roleB].id}/travels/${travel.id}`, createAuthOptions(userInRole[roleA]));
      expect(response.status).toBe(403);
    });

    it.each([
      [TestUserType.asAdmin, TestUserType.asAnotherUser],
      [TestUserType.asAdmin, TestUserType.asAnotherAdmin],
    ])('should allow a %s to delete %s travels', async (roleA, roleB) => {
      const travel = await addTravel(userInRole[roleB].id, createAuthOptions(userInRole[roleB]));

      const response = await axios.delete(`user/${userInRole[roleB].id}/travels/${travel.id}`, createAuthOptions(userInRole[roleA]));
      expect(response.status).toBe(204);
    });
  });

});
