import { RoleType } from '../../../common/roleType';

export interface JwtPayload {
  readonly sub: string;
  readonly username: string;
  readonly roles: RoleType[];
}
