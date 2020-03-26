import { TestUserType } from './interfaces';

export const users = {
    [TestUserType.asUser]: {
        id: '66c96499-00ca-4e03-85eb-c65486c3edd7',
        firstName: 'first',
        lastName: 'secondd',
        userName: 'testuser',
        password: 'qwer1234',
        roles: ['user'],
    },
    [TestUserType.asManager]: {
        id: '0dfef6fe-cb6d-4fbb-b35b-114dd3672336',
        firstName: 'manager',
        lastName: 'manager',
        userName: 'manager@manager.com',
        password: 'qwer1234',
        roles: ['manager'],
    },
    [TestUserType.asAdmin]: {
        id: 'e8c39428-32d9-4f01-96f3-0d565885dbc9',
        firstName: 'admin',
        lastName: 'admin',
        userName: 'admin@admin.com',
        password: 'qwer1234',
        roles: ['user', 'manager', 'admin'],
    },
};
