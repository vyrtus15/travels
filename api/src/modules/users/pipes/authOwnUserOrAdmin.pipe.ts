import { ArgumentMetadata, Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { AbstractAuthPipe } from '../../../pipes/AbstractAuth.pipe';
import { UserDto } from '../dto/user.dto';
import { UsersService } from '../services/users.service';

/**
 * Perform user authorization to match one of the following rules:
 * - current user accesses his own user record
 * - current user is `admin`
 */
@Injectable({ scope: Scope.REQUEST })
export class AuthOwnUserOrAdminPipe extends AbstractAuthPipe<string, Promise<UserDto>> {
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
    // Allow user to access own record.
    if (this.isSelfUser(id)) {
      return user;
    }

    // Admin can access any user record.
    if (this.isAdmin()) {
      return user;
    }

    this.throwForbidden();
  }
}
