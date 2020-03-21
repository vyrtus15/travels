import { ConfigService } from '@nestjs/config';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../../auth/services/auth.service';
import { SeedService } from './seed.service';
import { mockQuery } from '../../../../../test/helpers/utils.jest';

describe('Seed Service', () => {
  let authService: AuthService;
  let configService: ConfigService;
  let seedService: SeedService;
  let userModel: any;

  beforeEach(async () => {
    userModel = jest.fn();
    userModel.findOne = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SeedService, {
          provide: AuthService,
          useValue: {
            register: jest.fn(),
          },
        }, {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        }, {
          provide: getModelToken('User'),
          useValue: userModel,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    configService = module.get<ConfigService>(ConfigService);
    seedService = module.get<SeedService>(SeedService);
  });

  it('should skip when admin & manager already created', async () => {
    mockQuery(userModel.findOne, { userName: 'admin' });

    await seedService.onModuleInit();
    expect(authService.register).toBeCalledTimes(0);
  });

  it('should register admin & manager when missing', async () => {
    mockQuery(userModel.findOne, null);

    await seedService.onModuleInit();
    expect(authService.register).toBeCalledTimes(2);
  });

});
