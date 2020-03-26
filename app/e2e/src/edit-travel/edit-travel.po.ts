import { getElementByCss } from '../utils/element';
import { ElementFinder } from 'protractor';

export class EditTravelPage {
  getTitle() {
    return getElementByCss('app-edit-travel mat-card-title').getText();
  }

  getDestinationField() {
    return getElementByCss('input[formcontrolname="destination"]');
  }

  getStartDateField() {
    return getElementByCss('input[formcontrolname="startDate"]');
  }

  getEndDateField() {
    return getElementByCss('input[formcontrolname="endDate"]');
  }

  getCommentField() {
    return getElementByCss('input[formcontrolname="comment"]');
  }

  getSubmitButton() {
    return getElementByCss('app-edit-travel  mat-card-actions button');
  }

  getUpdateTravelSuccessMessage() {
    return getElementByCss('#cdk-overlay-0 > snack-bar-container > simple-snack-bar > span').getText();
  }

  getValue(target: ElementFinder) {
    return target.getAttribute('value');
  }

  submit() {
    const button = this.getSubmitButton();
    button.click();
  }
}
