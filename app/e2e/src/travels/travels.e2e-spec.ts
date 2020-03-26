import { login } from '../login/login.po';
import { users } from '../utils/context';
import { TestUserType } from '../utils/interfaces';
import { TravelsPage } from './travels.po';

describe('[e2e] Travels page', () => {
  let page: TravelsPage;

  const user = users[TestUserType.asUser];

  beforeAll(async () => {
    await login(user);
  });

  beforeEach(() => {
    page = new TravelsPage();
  });

  it('should display travels title', () => {
    page.navigateTo(user.id);
    expect(page.getTitle()).toEqual('Travels');
  });

});
