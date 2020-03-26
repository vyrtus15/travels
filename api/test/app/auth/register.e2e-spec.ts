import { default as axios } from 'axios';
import { randomUser } from '../../helpers/user';
import { createTestContext, destroyTestContext } from '../../setup';

describe('/auth (e2e)', () => {

  beforeAll(async () => {
    await createTestContext();
  });

  afterAll(async () => {
    await destroyTestContext();
  });

  describe('/register (POST)', () => {
    it.each([
      ['userName', null],
      ['firstName', null],
      ['lastName', null],
      ['password', null],
      ['password', '123'], // password minLength 6
    ])('should validate when %s is %s', async (field, value) => {
      const data = randomUser();
      data[field] = value;

      const response = await axios.post('auth/register', data);

      expect(response.status).toBe(400);
    });

    it('should allow a user to register', async () => {
      const response = await axios.post('auth/register', randomUser());
      expect(response.status).toBe(201);
    });
  });
});
