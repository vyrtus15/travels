import { navigate, wait } from '../utils';
import { getElementByCss, fillInput } from '../utils/element';
import { Travel } from '../utils/interfaces';

export class AddTravelPage {
  navigateTo(userId: string) {
    return navigate(`travels/${userId}/add`);
  }

  getTitle() {
    return getElementByCss('app-root mat-card-title').getText() as Promise<string>;
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
    return getElementByCss('app-add-travel  mat-card-actions button');
  }

  getAddTravelSuccessMessage() {
    return getElementByCss('#cdk-overlay-0 > snack-bar-container > simple-snack-bar > span').getText();
  }

  submit() {
    const button = this.getSubmitButton();
    button.click();
  }

  getRandom(): Travel {
    return {
      destination: 'Destination' + Math.random(),
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
      comment: 'Comment ' + Math.random(),
    };
  }
}

export async function addTravel(userId: string, travel: Travel) {
  const page = new AddTravelPage();

  await page.navigateTo(userId);

  fillInput(page.getDestinationField(), travel.destination);
  fillInput(page.getStartDateField(), travel.startDate);
  fillInput(page.getEndDateField(), travel.endDate);
  fillInput(page.getCommentField(), travel.comment);

  page.submit();

  await wait(1000);
}
