import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { JwtStrategy } from './jwt.strategy';

describe('Jwt Strategy', () => {
  let authService: AuthService;
  let jwtStrategy: JwtStrategy;

  beforeEach(() => {
    authService = {
      validateUser: jest.fn(),
    } as any;

    const configService = {
      get: () => 'test value',
    } as any;

    jwtStrategy = new JwtStrategy(authService, configService);
  });

  it('should throw when user not validated', async () => {
    await expect(jwtStrategy.validate({} as any)).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('should return the validated user', async () => {
    const user: any = { userName: 'test' };
    jest.spyOn(authService, 'validateUser').mockImplementation(async () => user);

    expect(await jwtStrategy.validate({} as any)).toBe(user);
  });
});
