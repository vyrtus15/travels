import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleType } from '../../../common/roleType';
import { RoleGuard } from './role.guard';

describe('Role Guard', () => {
  let reflectorMock: Reflector;
  let contextMock: ExecutionContext;
  let getRequestMock: jest.Mock;

  let guard: RoleGuard;

  beforeEach(() => {
    reflectorMock = {
      get: jest.fn(),
    } as any;

    getRequestMock = jest.fn().mockReturnValue({});
    contextMock = {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: () => ({
        getRequest: getRequestMock,
      }),
    } as any;

    guard = new RoleGuard(reflectorMock);
  });

  it.each([null, {}])('should pass when `roles` is `%p`', (value) => {
    jest.spyOn(reflectorMock, 'get').mockReturnValue(value);
    expect(guard.canActivate(contextMock)).toBe(true);
  });

  it.each([
    [[RoleType.user], [RoleType.user]],
    [[RoleType.manager, RoleType.user], []],
    [[RoleType.manager, RoleType.user], [RoleType.admin, RoleType.user]],
  ])('should pass when any of the `roles` are contained', (handlerRoles, classRoles) => {
    jest.spyOn(reflectorMock, 'get').mockReturnValueOnce(handlerRoles);
    jest.spyOn(reflectorMock, 'get').mockReturnValueOnce(classRoles);
    getRequestMock.mockReturnValue({ user: { roles: [RoleType.user] } });

    expect(guard.canActivate(contextMock)).toBe(true);
  });

  it.each([
    [{}, RoleType.user],
    [{ user: {} }, RoleType.user],
    [{ user: { roles: [RoleType.user, RoleType.manager] } }, RoleType.admin],
  ])('should not pass when user %p has no role %s', (user, requiredRole) => {
    jest.spyOn(reflectorMock, 'get').mockReturnValue([requiredRole]);

    getRequestMock.mockReturnValue(user);

    expect(guard.canActivate(contextMock)).toBe(false);
  });

  it.each([
    [[RoleType.manager, RoleType.user], [RoleType.admin, RoleType.user]],
    [[RoleType.admin, RoleType.user], [RoleType.manager, RoleType.user]],
  ])('should not pass when some of the `roles` are not contained', (handlerRoles, classRoles) => {
    jest.spyOn(reflectorMock, 'get').mockReturnValueOnce(handlerRoles);
    jest.spyOn(reflectorMock, 'get').mockReturnValueOnce(classRoles);

    getRequestMock.mockReturnValue({ user: { roles: [RoleType.admin] } });

    expect(guard.canActivate(contextMock)).toBe(false);
  });
});
