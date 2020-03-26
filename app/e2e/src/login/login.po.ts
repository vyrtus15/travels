import { navigate, wait } from '../utils';
import { fillInput, getElementByCss } from '../utils/element';
import { User } from '../utils/interfaces';

export class LoginPage {
  navigateTo() {
    return navigate('');
  }

  getCardTitle() {
    return getElementByCss('app-root mat-card-title').getText() as Promise<string>;
  }

  getUsernameField() {
    return getElementByCss('input[placeholder="Username"]');
  }

  getPasswordField() {
    return getElementByCss('input[placeholder="Password"]');
  }

  getSubmitButton() {
    return getElementByCss('app-login mat-card-actions button');
  }

  submit() {
    const button = this.getSubmitButton();
    button.click();
  }
}

export async function login(user: User) {
  const page = new LoginPage();

  await page.navigateTo();

  fillInput(page.getUsernameField(), user.userName);
  fillInput(page.getPasswordField(), user.password);

  page.submit();

  await wait(1000);
}
