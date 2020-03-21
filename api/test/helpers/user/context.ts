import { loginAsNewAdmin, loginAsNewManager, loginAsNewUser } from '.';
import { TestUserType, UserTestContext } from '../interfaces';

export async function extendedUserTestContext(): Promise<UserTestContext> {
  return {
    [TestUserType.asUser]: await loginAsNewUser(),
    [TestUserType.asAnotherUser]: await loginAsNewUser(),
    [TestUserType.asManager]: await loginAsNewManager(),
    [TestUserType.asAnotherManager]: await loginAsNewManager(),
    [TestUserType.asAdmin]: await loginAsNewAdmin(),
    [TestUserType.asAnotherAdmin]: await loginAsNewAdmin(),
  };
}
