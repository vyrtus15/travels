import { ForbiddenException } from '@nestjs/common';
import { RoleType } from '../../../common/roleType';
import { TravelsService } from '../services/travels.service';
import { AuthTravelPipe } from './authTravel.pipe';

describe('AuthTravel Pipe', () => {
  let pipe: AuthTravelPipe;
  let travelsService: TravelsService;
  let request: any;

  beforeEach(() => {
    request = {};
    travelsService = {
      findOne: jest.fn(),
    } as any;
    pipe = new AuthTravelPipe(travelsService, request);
  });

  it('should throw when user not authenticated', async () => {
    await expect(pipe.transform(['1', '2'], undefined)).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('should return the `travel` when is self', async () => {
    request.user = { id: 'user-1', roles: [RoleType.user] };

    jest.spyOn(travelsService, 'findOne').mockImplementation(async () => ({ id: 'abc', userId: 'user-1' } as any));

    expect(await pipe.transform(['user-1', 'abc'], undefined)).toMatchObject({ id: 'abc' });
  });

  it('should return the `travel` when is `admin`', async () => {
    request.user = { id: 'admin', roles: [RoleType.admin] };

    jest.spyOn(travelsService, 'findOne').mockImplementation(async () => ({ id: 'abc', userId: 'user-2' } as any));

    expect(await pipe.transform(['user-2', 'abc'], undefined)).toMatchObject({ id: 'abc' });
  });

  it('should throw when is `moderator`', async () => {
    request.user = { id: 'moderator', roles: [RoleType.manager] };

    jest.spyOn(travelsService, 'findOne').mockImplementation(async () => ({ id: 'abc' } as any));

    await expect(pipe.transform(['moderator', 'abc'], undefined)).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('should throw when is `user` and access another `user` travel', async () => {
    request.user = { id: 'userB', roles: [RoleType.user] };

    jest.spyOn(travelsService, 'findOne').mockImplementation(async () => ({ userId: 'userA' } as any));

    await expect(pipe.transform(['userB', 'abc'], undefined)).rejects.toBeInstanceOf(ForbiddenException);
  });
});
