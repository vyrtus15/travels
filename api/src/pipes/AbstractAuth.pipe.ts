import { ArgumentMetadata, ForbiddenException, PipeTransform } from '@nestjs/common';
import { RoleType } from '../common/roleType';

export abstract class AbstractAuthPipe<TIn, TOut> implements PipeTransform<TIn, TOut> {
  constructor(protected readonly request: any) { }

  abstract transform(data: TIn, metadata: ArgumentMetadata): TOut;

  protected isAuthenticated() {
    return !!this.request.user;
  }

  protected isSelf(value) {
    return this.request.user?.id === value;
  }

  protected isAdmin() {
    return this.isInRole(RoleType.admin);
  }

  protected isModerator() {
    return this.isInRole(RoleType.manager);
  }

  protected isUser() {
    return this.isInRole(RoleType.user);
  }

  protected throwForbidden() {
    throw new ForbiddenException();
  }

  private isInRole(role: RoleType) {
    return Array.isArray(this.request.user?.roles) &&
      this.request.user.roles.indexOf(role) !== -1;
  }
}
