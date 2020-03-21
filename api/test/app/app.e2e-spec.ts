import { default as axios } from 'axios';
import { setupAxios } from '../setup/axios';

describe('App (e2e)', () => {
  beforeAll(() => {
    setupAxios();
  });

  it('/health (GET)', async () => {
    const response = await axios.get('health');
    expect(response.status).toBe(200);
  });

  it('/docs (GET) should be disabled for production', async () => {
    const response = await axios.get('docs');
    expect(response.status).toBe(404);
  });
});
