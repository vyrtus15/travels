import { ElementFinder } from 'protractor';
import { navigate } from '../utils';
import { getElementByCss } from '../utils/element';

export class RegisterPage {
  navigateTo() {
    return navigate('register');
  }

  getCardTitle() {
    return getElementByCss('app-root mat-card-title').getText() as Promise<string>;
  }

  getUsernameField() {
    return getElementByCss('input[placeholder="Username"]');
  }

  getFirstnameField() {
    return getElementByCss('input[placeholder="First name"]');
  }

  getLastnameField() {
    return getElementByCss('input[placeholder="Last name"]');
  }

  getPasswordField() {
    return getElementByCss('input[placeholder="Password"]');
  }

  getSubmitButton() {
    return getElementByCss('app-register mat-card-actions button');
  }

  getRegisterSuccessMessage() {
    return getElementByCss('#cdk-overlay-0 > snack-bar-container > simple-snack-bar > span').getText();
  }

  fillInput(input: ElementFinder, value: string) {
    return input.sendKeys(value);
  }

  register() {
    const button = this.getSubmitButton();
    button.click();
  }
}
