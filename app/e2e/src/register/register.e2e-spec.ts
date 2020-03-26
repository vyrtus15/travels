import { RegisterPage } from './register.po';
import { ElementFinder } from 'protractor';

describe('[e2e] Register page', () => {
  let page: RegisterPage;

  beforeEach(() => {
    page = new RegisterPage();
  });

  it('should display register title', async () => {
    await page.navigateTo();
    expect(page.getCardTitle()).toEqual('Register');
  });

  [
    ['userName', () => page.getUsernameField()],
    ['firstName', () => page.getFirstnameField()],
    ['lastName', () => page.getLastnameField()],
    ['password', () => page.getPasswordField()],
    ['submit', () => page.getSubmitButton()],
  ].forEach(([field, handler]: [string, () => ElementFinder]) => {
    it(`should display ${field} field`, async () => {
      await page.navigateTo();
      expect(handler()).toBeTruthy();
    });
  });

  // Make sure before running this test user with such userName does not exists
  it('should register', async () => {
    await page.navigateTo();

    page.fillInput(page.getUsernameField(), 'testuser2');
    page.fillInput(page.getFirstnameField(), 'first');
    page.fillInput(page.getLastnameField(), 'second');
    page.fillInput(page.getPasswordField(), 'qwer1234');

    page.register();

    expect(page.getRegisterSuccessMessage()).toEqual('Account created, please log in.');
    expect(page.getCardTitle()).toEqual('Login');
  });
});

export function wait(timeout: number) {
  return new Promise((resolve) => setTimeout(resolve, timeout));
}
