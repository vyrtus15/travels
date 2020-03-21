import { ArgumentMetadata, Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { AbstractAuthPipe } from '../../../pipes/AbstractAuth.pipe';
import { UserDto } from '../dto/user.dto';
import { UsersService } from '../services/users.service';

@Injectable({ scope: Scope.REQUEST })
export class AuthOwnUserPipe extends AbstractAuthPipe<string, Promise<UserDto>> {
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
    if (this.isSelf(id)) {
      // Allow user access to own record.
      return user;
    }

    if (this.isAdmin()) {
      // Admin can access any user record.
      return user;
    }

    this.throwForbidden();
  }
}
