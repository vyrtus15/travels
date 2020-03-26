import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleType } from '../../../common/roleType';
import { UserDto } from '../../users/dto/user.dto';

@Injectable()
export class RoleGuard implements CanActivate {
  static readonly metadataKey = 'roles';
  constructor(private readonly reflector: Reflector) { }

  canActivate(context: ExecutionContext): boolean {
    const handlerRoles = this.reflector.get<RoleType[]>(RoleGuard.metadataKey, context.getHandler());
    const controllerRoles = this.reflector.get<RoleType[]>(RoleGuard.metadataKey, context.getClass());

    // Allow access when no permission required
    if (this.isEmpty(handlerRoles) && this.isEmpty(controllerRoles)) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user: UserDto = request.user;
    // Restrict acccess when user not present or does not have roles.
    if (!user || !Array.isArray(user.roles)) {
      return false;
    }

    const matchPermissions = this.matchRoles(handlerRoles, user.roles) && this.matchRoles(controllerRoles, user.roles);

    return matchPermissions;
  }

  private matchRoles(targetRoles: RoleType[], userRoles: RoleType[]) {
    if (this.isEmpty(targetRoles)) {
      return true;
    }

    return targetRoles.some(allowedRole => userRoles.indexOf(allowedRole) !== -1);
  }

  private isEmpty<T>(array: T[]) {
    return !Array.isArray(array) || array.length === 0;
  }
}
