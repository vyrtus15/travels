import { default as axios } from 'axios';
import { TestUser } from '../../helpers/interfaces';
import { loginAsNewUser } from '../../helpers/user';
import { createTestContext, destroyTestContext } from '../../setup';

describe('/auth (e2e)', () => {
  let user: TestUser;

  beforeAll(async () => {
    await createTestContext();
    user = await loginAsNewUser();
  });

  afterAll(async () => {
    await destroyTestContext();
  });

  describe('/login (POST)', () => {
    it('should issue an access token', async () => {
      const response = await axios.post('auth/login', {
        userName: user.userName,
        password: user.password,
      });

      expect(response.status).toBe(200);
      expect(response.data.userId).toBe(user.id);
      expect(response.data.accessToken).toBeDefined();
    });

    it('should respond with 401 when invalid userName', async () => {
      const response = await axios.post('auth/login', {
        userName: user.userName + '1',
        password: user.password,
      });

      expect(response.status).toBe(401);
    });

    it('should respond with 401 when invalid password', async () => {
      const response = await axios.post('auth/login', {
        userName: user.userName,
        password: user.password + '1',
      });

      expect(response.status).toBe(401);
    });
  });
});
