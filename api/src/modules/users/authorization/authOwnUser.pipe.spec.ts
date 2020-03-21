import { ForbiddenException } from '@nestjs/common';
import { RoleType } from '../../../common/roleType';
import { UsersService } from '../services/users.service';
import { AuthOwnUserPipe } from './authOwnUser.pipe';

describe('AuthOwnUser Pipe', () => {
  let pipe: AuthOwnUserPipe;
  let usersService: UsersService;
  let request: any;

  beforeEach(() => {
    request = {};
    usersService = {
      findOne: jest.fn(),
    } as any;
    pipe = new AuthOwnUserPipe(usersService, request);
  });

  it('should throw when user not authenticated', async () => {
    await expect(pipe.transform('abc', undefined)).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('should return the `user` when is self', async () => {
    const accessedUser: any = { id: 'abc' };
    request.user = { id: 'abc' };

    jest.spyOn(usersService, 'findOne').mockImplementation(async () => accessedUser);

    expect(await pipe.transform('abc', undefined)).toMatchObject(accessedUser);
  });

  it('should return the `user` when is `admin`', async () => {
    const accessedUser: any = { id: 'userA' };
    request.user = { id: 'admin', roles: [RoleType.admin] };

    jest.spyOn(usersService, 'findOne').mockImplementation(async () => accessedUser);

    expect(await pipe.transform(accessedUser.id, undefined)).toMatchObject(accessedUser);
  });

  it('should throw when is `moderator` and access another user', async () => {
    const accessedUser: any = { id: 'userA', roles: [RoleType.user] };
    request.user = { id: 'moderator', roles: [RoleType.manager] };

    jest.spyOn(usersService, 'findOne').mockImplementation(async () => accessedUser);

    await expect(pipe.transform(accessedUser.id, undefined)).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('should throw when is `user` and access another `user`', async () => {
    const accessedUser: any = { id: 'userA', roles: [RoleType.user] };
    request.user = { id: 'userB', roles: [RoleType.user] };

    jest.spyOn(usersService, 'findOne').mockImplementation(async () => accessedUser);

    await expect(pipe.transform(accessedUser.id, undefined)).rejects.toBeInstanceOf(ForbiddenException);
  });
});
