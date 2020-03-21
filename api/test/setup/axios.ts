import { default as axios } from 'axios';
import { TestUser } from '../helpers/interfaces';

export function setupAxios() {
  axios.defaults.baseURL = process.env.HTTP_ABSOLUTE_PATH;
  axios.defaults.validateStatus = () => true;
}

export function createAuthOptions(accessToken: string | Pick<TestUser, 'accessToken'>) {
  accessToken = typeof accessToken === 'string' ? accessToken : accessToken.accessToken;
  return {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };
}
