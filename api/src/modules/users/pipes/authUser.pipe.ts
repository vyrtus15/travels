import { ArgumentMetadata, Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { RoleType } from '../../../common/roleType';
import { AbstractAuthPipe } from '../../../pipes/AbstractAuth.pipe';
import { UserDto } from '../dto/user.dto';
import { UsersService } from '../services/users.service';

/**
 * Pipe used to perform auth for users who should access user entity, based on Roles.
 * To match one of the following rules:
 * - current user accesses his own user record
 * - current user is `admin`
 * - current user is `manager` and accessed user is `user`
 */
@Injectable({ scope: Scope.REQUEST })
export class AuthUserPipe extends AbstractAuthPipe<string, Promise<UserDto>> {
  constructor(
    private readonly userService: UsersService,
    @Inject(REQUEST) request: any,
  ) {
    super(request);
  }

  async transform(id: string, metadata: ArgumentMetadata) {
    if (!this.isAuthenticated()) {
      this.throwForbidden();
    }

    const user = await this.userService.findOne(id);
    // Allow user access to own record.
    if (this.isSelfUser(id)) {
      return user;
    }

    // Admin can access any user record.
    if (this.isAdmin()) {
      return user;
    }

    // A `manager` user can access only `user` records.
    if (this.isManager()) {
      const isTargetAUser = user.roles?.length === 1 && user.roles[0] === RoleType.user;
      if (isTargetAUser) {
        return user;
      }
    }

    this.throwForbidden();
  }
}
