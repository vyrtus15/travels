import { browser, ElementFinder } from 'protractor';
import { login } from '../login/login.po';
import { TravelsPage } from '../travels/travels.po';
import { wait } from '../utils';
import { users } from '../utils/context';
import { fillInput } from '../utils/element';
import { TestUserType } from '../utils/interfaces';
import { EditTravelPage } from './edit-travel.po';

describe('[e2e] Edit travel page', () => {
  let travelsPage: TravelsPage;
  let editPage: EditTravelPage;
  let travel;

  const user = users[TestUserType.asUser];

  beforeAll(async () => {
    await login(user);
  });

  beforeEach(async () => {
    travelsPage = new TravelsPage();
    editPage = new EditTravelPage();

    travelsPage.navigateTo(user.id);
    travel = travelsPage.getFirstTravelDetails();
  });

  it('should display edit travel title', async () => {
    travel.editBtn.click();
    await wait(100);

    expect(editPage.getTitle()).toEqual('Edit Travel');
  });

  [
    ['destination', () => editPage.getDestinationField()],
    ['startDate', () => editPage.getStartDateField()],
    ['endDate', () => editPage.getEndDateField()],
    ['comment', () => editPage.getCommentField()],
    ['submit', () => editPage.getSubmitButton()],
  ].forEach(([field, handler]: [string, () => ElementFinder]) => {
    it(`should display ${field} field`, async () => {
      travel.editBtn.click();
      await wait(100);

      expect(handler()).toBeTruthy();
    });
  });

  [
    ['destination', () => editPage.getDestinationField()],
    ['comment', () => editPage.getCommentField()],
  ].forEach(([field, handler]: [string, () => ElementFinder]) => {
    it(`should display value for ${field} field`, async () => {
      travel.editBtn.click();
      await wait(100);

      expect(editPage.getValue(handler())).toEqual(travel[field]);
    });
  });

  it('should be able to update travel', async () => {
    travel.editBtn.click();
    await wait(100);

    fillInput(editPage.getDestinationField(), '42');
    editPage.submit();
    await wait(1000);

    expect(editPage.getUpdateTravelSuccessMessage()).toEqual('Travel updated');
    expect(browser.getCurrentUrl()).toEqual(`${browser.baseUrl}travels/${user.id}`);
  });
});
