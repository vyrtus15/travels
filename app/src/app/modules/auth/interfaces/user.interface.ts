export class User {
  id: string;

  userName: string;
  firstName: string;
  lastName: string;

  roles: RoleType[];
  createdOn: Date;
}

export enum RoleType {
  user = 'user',
  manager = 'manager',
  admin = 'admin',
}
