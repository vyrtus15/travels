import { SetMetadata, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RoleType } from '../../../common/roleType';
import { RoleGuard } from '../guards/role.guard';

export const Roles = (...roles: RoleType[]) => SetMetadata(RoleGuard.metadataKey, roles);
export const Authorize = () => UseGuards(AuthGuard('jwt'), RoleGuard);
