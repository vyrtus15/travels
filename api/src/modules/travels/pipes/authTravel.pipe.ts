import { ArgumentMetadata, Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { AbstractAuthPipe } from '../../../pipes/AbstractAuth.pipe';
import { TravelDto } from '../dto/travel.dto';
import { TravelsService } from '../services/travels.service';

/**
 * Pipe used to perform auth for users who should access to travel, based on Roles.
 */
@Injectable({ scope: Scope.REQUEST })
export class AuthTravelPipe extends AbstractAuthPipe<[string, string], Promise<TravelDto>> {
  constructor(
    private readonly travelsService: TravelsService,
    @Inject(REQUEST) request: any,
  ) {
    super(request);
  }

  async transform([userId, id]: [string, string], metadata: ArgumentMetadata) {
    if (!this.isAuthenticated()) {
      this.throwForbidden();
    }

    const isAdmin = this.isAdmin();
    const isUser = this.isUser();

    // Manager has no access to travels
    if (!isAdmin && !isUser) {
      this.throwForbidden();
    }

    const travel = await this.travelsService.findOne(id);
    if (this.isAdmin()) {
      // An admin has access to any record.
      return travel;
    }

    // An user has access only to his own travels
    if (travel.userId === this.request.user.id) {
      return travel;
    }

    this.throwForbidden();
  }
}
