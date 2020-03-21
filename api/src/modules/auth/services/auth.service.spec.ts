import { ConflictException, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { createEmptyQueryMock } from '../../../../test/helpers/utils.jest';
import { RoleType } from '../../../common/roleType';
import { SchemaNames } from '../../../common/schemas';
import { UsersService } from '../../users/services/users.service';
import { AuthService } from './auth.service';

describe('Auth Service', () => {
  let authService: AuthService;
  let jwtService: JwtService;
  let userService: UsersService;
  let userModel: any;

  beforeEach(async () => {
    userModel = jest.fn();
    userModel.register = jest.fn();
    userModel.findOne = createEmptyQueryMock();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService, {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
        }, {
          provide: UsersService,
          useValue: {
            findOne: jest.fn(),
          },
        }, {
          provide: getModelToken(SchemaNames.User),
          useValue: userModel,
        }],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    userService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('validateUser()', () => {
    it('should return the user', async () => {
      const user: any = { userName: '42' };
      jest.spyOn(userService, 'findOne').mockImplementation(async () => user);

      const result = await authService.validateUser({} as any);
      expect(result).toBe(user);
    });

    it('should return `null` when user not found', async () => {
      jest.spyOn(userService, 'findOne').mockImplementation(async () => {
        throw new HttpException('42 message', HttpStatus.NOT_FOUND);
      });

      const result = await authService.validateUser({} as any);
      expect(result).toBeNull();
    });

    it('should propagate error from `userService`', async () => {
      jest.spyOn(userService, 'findOne').mockImplementation(async () => {
        throw new Error();
      });

      await expect(authService.validateUser({} as any)).rejects.toBeInstanceOf(Error);
    });
  });

  describe('createToken()', () => {
    it('should throw when user is `null`', async () => {
      await expect(authService.createToken(null)).rejects.toBeInstanceOf(Error);
    });

    it('should return an access token', async () => {
      const user = {
        id: '42',
        userName: 'test42',
        roles: [RoleType.manager],
      };

      jest.spyOn(jwtService, 'signAsync').mockImplementation(async (x) => x as any);
      expect(await authService.createToken(user as any)).toMatchObject({
        accessToken: {
          sub: user.id,
          username: user.userName,
          roles: user.roles,
        },
      });
    });
  });

  describe('register', () => {
    const user: any = {
      userName: 'test',
      password: 'pass',
    };

    it('should find user by userName', async () => {
      jest.spyOn(userModel, 'findOne').mockImplementation(async () => null);

      await authService.register(user, RoleType.user);

      expect(userModel.findOne).toBeCalledWith({ userName: user.userName });
    });

    it('should throw error if user exists', async () => {
      jest.spyOn(userModel, 'findOne').mockImplementation(async () => user);

      await expect(authService.register(user)).rejects.toBeInstanceOf(ConflictException);
    });

    it('should register user', async () => {
      jest.spyOn(userModel, 'findOne').mockImplementation(async () => null);

      await authService.register(user, RoleType.user);

      expect(userModel.register).toBeCalledTimes(1);
    });
  });

});
