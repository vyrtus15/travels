import { browser, ElementFinder } from 'protractor';
import { login } from '../login/login.po';
import { users } from '../utils/context';
import { TestUserType } from '../utils/interfaces';
import { addTravel, AddTravelPage } from './add-travel.po';

describe('[e2e] Add travel page', () => {
  let page: AddTravelPage;

  const user = users[TestUserType.asUser];

  beforeAll(async () => {
    await login(user);
  });

  beforeEach(() => {
    page = new AddTravelPage();
  });

  it('should display add travel title', async () => {
    await page.navigateTo(user.id);
    expect(page.getTitle()).toEqual('Create Travel');
  });

  [
    ['destination', () => page.getDestinationField()],
    ['startDate', () => page.getStartDateField()],
    ['endDate', () => page.getEndDateField()],
    ['comment', () => page.getCommentField()],
    ['submit', () => page.getSubmitButton()],
  ].forEach(([field, handler]: [string, () => ElementFinder]) => {
    it(`should display ${field} field`, async () => {
      await page.navigateTo(user.id);
      expect(handler()).toBeTruthy();
    });
  });

  it('should be able to add new travel', async () => {
    await addTravel(user.id, page.getRandom());

    expect(page.getAddTravelSuccessMessage()).toEqual('Travel created');
    expect(browser.getCurrentUrl()).toEqual(`${browser.baseUrl}travels/${user.id}`);
  });
});
