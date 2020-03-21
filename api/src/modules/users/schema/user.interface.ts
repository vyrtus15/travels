import { PassportLocalDocument } from 'mongoose';
import { RoleType } from '../../../common/roleType';

export interface User extends PassportLocalDocument {
  firstName: string;
  lastName: string;
  userName: string

  roles: RoleType[];
}
