import { Test, TestingModule } from '@nestjs/testing';
import { RoleType } from '../../../common/roleType';
import { UserDto } from '../dto/user.dto';
import { UsersService } from '../services/users.service';
import { UsersController } from './users.controller';
import { PageDto } from '../../../dto/page.dto';

describe('Users Controller', () => {
  let userService: UsersService;
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{
        provide: UsersService,
        useValue: {
          find: jest.fn(),
          findOne: jest.fn(),
          update: jest.fn(),
          delete: jest.fn(),
        },
      }],
    }).compile();

    userService = module.get<UsersService>(UsersService);
    controller = new UsersController(userService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return current user', async () => {
    const user = createTestUser();
    jest.spyOn(userService, 'findOne').mockImplementation(async () => user);

    expect(await controller.getCurrent({ user: { id: 'abc' } })).toBe(user);
  });

  it('should throw for current user when request user not set', async () => {
    await expect(controller.getCurrent({ user: null })).rejects.toBeInstanceOf(Error);
  });

  it('should return a list of users for admin', async () => {
    const usersList = [createTestUser('a'), createTestUser('b'), createTestUser('c')];
    jest.spyOn(userService, 'find').mockImplementation(async () => ({ items: [...usersList] } as any));

    const request = { user: { roles: [RoleType.admin] } };
    expect(await controller.getUsers({} as PageDto, request)).toMatchObject({ items: usersList });
  });

  it('should apply `user` role filter for a manager', async () => {
    const usersList = [createTestUser('a'), createTestUser('b'), createTestUser('c')];
    jest.spyOn(userService, 'find').mockImplementation(async () => ({ items: [...usersList] } as any));

    await controller.getUsers({} as PageDto, { user: { roles: [RoleType.manager] } });
    expect((userService.find as jest.Mock).mock.calls[0][1]).toBe(RoleType.user);
  });

  it('should update a user', async () => {
    const user = createTestUser();
    jest.spyOn(userService, 'update').mockImplementation(async (data) => user);

    expect(await controller.updateUser(user, { firstName: 'test', lastName: 'test' })).toBe(user);
  });

  it('should delete a user', async () => {
    const user = createTestUser();
    await controller.deleteUser(user);
    expect(userService.delete).toBeCalledWith(user.id);
  });
});

function createTestUser(id: string = 'abc'): any {
  return {
    id,
    firstName: 'John',
    lastName: 'Doe',
    userName: 'john@doe.com',
    roles: [RoleType.user],
  } as Partial<UserDto>;
}
