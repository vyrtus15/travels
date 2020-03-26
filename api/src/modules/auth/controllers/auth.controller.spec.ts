import { Test, TestingModule } from '@nestjs/testing';
import { RoleType } from '../../../common/roleType';
import { AuthService } from '../services/auth.service';
import { AuthController } from './auth.controller';

describe('Auth Controller', () => {
    let authService: AuthService;
    let controller: AuthController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [{
                provide: AuthService,
                useValue: {
                    createToken: jest.fn(),
                    register: jest.fn(),
                },
            }],
        }).compile();

        authService = module.get<AuthService>(AuthService);
        controller = new AuthController(authService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should login', async () => {
        const expectedResult: any = { accessToken: 'my-token' };
        jest.spyOn(authService, 'createToken').mockImplementation(async () => expectedResult);

        const actualResult = await controller.login({ user: {} });

        expect(actualResult).toBe(expectedResult);
    });

    it('should login with request credentials', async () => {
        const token: any = { accessToken: 'my-token' };
        jest.spyOn(authService, 'createToken').mockImplementation(async () => token);

        const request = { user: {} };
        await controller.login(request);

        expect(authService.createToken).toBeCalledWith(request.user);
    });

    it('should register a given user', async () => {
        const user = { firstName: '42' };
        await controller.register(user as any);

        expect(authService.register).toBeCalledWith(user, RoleType.user);
    });

});
