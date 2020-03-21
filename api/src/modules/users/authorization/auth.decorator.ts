import { Param } from '@nestjs/common';
import { AuthOwnUserPipe } from './authOwnUser.pipe';
import { AuthUserPipe } from './authUser.pipe';

/**
 * Perform user authorization to match one of the following rules:
 * - current user accesses his own user record
 * - current user is `admin`
 * - current user is `moderator` and accessed user is `user`
 * @param idPropertyName the name of the request param field that holds the user id
 */
export const AuthUser = (idPropertyName: string) => Param(idPropertyName, AuthUserPipe);

/**
 * Perform user authorization to match one of the following rules:
 * - current user accesses his own user record
 * - current user is `admin`
 * @param idPropertyName the name of the request param field that holds the user id
 */
export const AuthOwnUser = (idPropertyName: string) => Param(idPropertyName, AuthOwnUserPipe);
