import { loginUser } from './loginUser';

export async function loginAdmin() {
  return await loginUser({
    userName: process.env.ADMIN_USERNAME,
    password: process.env.ADMIN_PASSWORD,
  });
}
