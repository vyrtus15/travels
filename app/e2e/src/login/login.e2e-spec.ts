import { ElementFinder, browser } from 'protractor';
import { LoginPage, login } from './login.po';
import { users } from '../utils/context';
import { TestUserType } from '../utils/interfaces';

describe('[e2e] Login page', () => {
  let page: LoginPage;

  beforeEach(() => {
    page = new LoginPage();
  });

  it('should display login title', async () => {
    await page.navigateTo();
    expect(page.getCardTitle()).toEqual('Login');
  });

  [
    ['userName', () => page.getUsernameField()],
    ['password', () => page.getPasswordField()],
    ['submit', () => page.getSubmitButton()],
  ].forEach(([field, handler]: [string, () => ElementFinder]) => {
    it(`should display ${field} field`, async () => {
      await page.navigateTo();
      expect(handler()).toBeTruthy();
    });
  });

  it('should login as user', async () => {
    const user = users[TestUserType.asUser];
    await login(user);

    // verify is user is redirected to travels page
    expect(browser.getCurrentUrl()).toEqual(`${browser.baseUrl}travels/${user.id}`);
  });

  it('should login as manager', async () => {
    const user = users[TestUserType.asManager];
    await login(user);

    // verify is manager is redirected to users page
    expect(browser.getCurrentUrl()).toEqual(`${browser.baseUrl}users`);
  });

  it('should login as admin', async () => {
    const user = users[TestUserType.asAdmin];
    await login(user);

    // verify is admin is redirected to users page
    expect(browser.getCurrentUrl()).toEqual(`${browser.baseUrl}users`);
  });
});
