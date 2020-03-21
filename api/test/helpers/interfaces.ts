export interface TestUser {
  id: string;
  userName: string;
  password: string;

  accessToken: string;
}

export enum TestUserType {
  asUser = 'user',
  asAnotherUser = 'another user',
  asManager = 'manager',
  asAnotherManager = 'another manager',
  asAdmin = 'admin',
  asAnotherAdmin = 'another admin',
}

export type UserTestContext = Record<TestUserType, TestUser>;
