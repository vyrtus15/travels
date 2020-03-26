import { Param } from '@nestjs/common';
import { AuthOwnUserOrAdminPipe } from '../pipes/authOwnUserOrAdmin.pipe';
import { AuthUserPipe } from '../pipes/authUser.pipe';

/**
 * Perform user authorization to match one of the following rules:
 * - current user accesses his own user record
 * - current user is `admin`
 * - current user is `manager` and accessed user is `user`
 * @param idPropertyName the name of the request param field that holds the user id
 */
export const AuthUser = (idPropertyName: string) => Param(idPropertyName, AuthUserPipe);

/**
 * Perform user authorization to match one of the following rules:
 * - current user accesses his own user record
 * - current user is `admin`
 * @param idPropertyName the name of the request param field that holds the user id
 */
export const AuthOwnUserOrAdmin = (idPropertyName: string) => Param(idPropertyName, AuthOwnUserOrAdminPipe);
