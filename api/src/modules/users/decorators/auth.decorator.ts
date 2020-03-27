import { Param } from '@nestjs/common';
import { AuthOwnUserOrAdminPipe } from '../pipes/authOwnUserOrAdmin.pipe';
import { AuthUserPipe } from '../pipes/authUser.pipe';

export const AuthUser = (idPropertyName: string) => Param(idPropertyName, AuthUserPipe);

export const AuthOwnUserOrAdmin = (idPropertyName: string) => Param(idPropertyName, AuthOwnUserOrAdminPipe);
