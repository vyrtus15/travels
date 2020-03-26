export enum TestUserType {
    asUser = 'user',
    asManager = 'manager',
    asAdmin = 'admin',
}

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    userName: string;
    password: string;
    roles: string[];
}


export interface Travel {
    destination: string;
    startDate: string;
    endDate: string;
    comment?: string;
}
