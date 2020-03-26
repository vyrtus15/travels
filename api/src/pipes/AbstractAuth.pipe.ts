import { ArgumentMetadata, ForbiddenException, PipeTransform } from '@nestjs/common';
import { RoleType } from '../common/roleType';

export abstract class AbstractAuthPipe<TIn, TOut> implements PipeTransform<TIn, TOut> {
  constructor(protected readonly request: any) { }

  abstract transform(data: TIn, metadata: ArgumentMetadata): TOut;

  protected isAuthenticated() {
    return !!this.request.user;
  }

  protected isSelfUser(value) {
    return this.request.user?.id === value;
  }

  protected isAdmin() {
    return this.hasRole(RoleType.admin);
  }

  protected isManager() {
    return this.hasRole(RoleType.manager);
  }

  protected isUser() {
    return this.hasRole(RoleType.user);
  }

  protected throwForbidden() {
    throw new ForbiddenException();
  }

  private hasRole(role: RoleType) {
    return Array.isArray(this.request.user?.roles) &&
      this.request.user.roles.indexOf(role) !== -1;
  }
}
