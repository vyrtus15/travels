import { Router } from '@angular/router';
import { RoleType } from '../modules/auth/interfaces/user.interface';
import { AuthService } from '../modules/auth/services/auth/auth.service';
import { UserService } from '../modules/auth/services/user/user.service';
import { RoleGuard } from './role.guard';

describe('Role Guard', () => {

    let guard: RoleGuard;

    const authServiceSpy = jasmine.createSpyObj<AuthService>('AuthService', ['isLoggedIn']);
    const routerSpy = jasmine.createSpyObj<Router>('Router', ['navigate']);
    const userServiceSpy = jasmine.createSpyObj<UserService>('UserService', ['get']);

    beforeEach(() => {
        guard = new RoleGuard(authServiceSpy, userServiceSpy, routerSpy);
    });

    it('should pass when roles is not defined', async () => {
        const canActivate = await guard.canActivate({ data: {} } as any);
        expect(canActivate).toBe(true);
    });

    it('should not pass when user is not authenticated', async () => {
        authServiceSpy.isLoggedIn.and.returnValue(false);

        const canActivate = await guard.canActivate({ data: { roles: [RoleType.user] } } as any);
        expect(canActivate).toBe(false);
    });

    it('should redirect when user is not authenticated', async () => {
        authServiceSpy.isLoggedIn.and.returnValue(false);

        await guard.canActivate({ data: { roles: [RoleType.user] } } as any);
        expect(routerSpy.navigate).toHaveBeenCalled();
    });

    it('should get user if authenticated', async () => {
        authServiceSpy.isLoggedIn.and.returnValue(true);

        await guard.canActivate({ data: { roles: [RoleType.user] } } as any);
        expect(userServiceSpy.get).toHaveBeenCalled();
    });

    it('should not pass if user is not returned', async () => {
        authServiceSpy.isLoggedIn.and.returnValue(true);
        userServiceSpy.get.and.returnValue(null);

        const canActivate = await guard.canActivate({ data: { roles: [RoleType.user] } } as any);
        expect(canActivate).toEqual(false);
    });

    it('should redirect if user is not returned', async () => {
        authServiceSpy.isLoggedIn.and.returnValue(true);
        userServiceSpy.get.and.returnValue(null);

        await guard.canActivate({ data: { roles: [RoleType.user] } } as any);
        expect(routerSpy.navigate).toHaveBeenCalled();
    });

    it('should not pass if user does not have roles', async () => {
        authServiceSpy.isLoggedIn.and.returnValue(true);
        userServiceSpy.get.and.returnValue({ id: '42' } as any);

        const canActivate = await guard.canActivate({ data: { roles: [RoleType.user] } } as any);
        expect(canActivate).toEqual(false);
    });

    [
        [[RoleType.user], [RoleType.user]],
        [[RoleType.manager, RoleType.user], [RoleType.manager]],
        [[RoleType.user], [RoleType.admin, RoleType.user]],
        [[RoleType.manager, RoleType.user], [RoleType.admin, RoleType.user]],
    ].forEach(([userRoles, targetRoles]) => {
        it('should pass when at least one of the `roles` is contained', async () => {
            authServiceSpy.isLoggedIn.and.returnValue(true);
            userServiceSpy.get.and.returnValue({ roles: userRoles } as any);

            const canActivate = await guard.canActivate({ data: { roles: targetRoles } } as any);
            expect(canActivate).toBe(true);
        });
    });

    [
        [[RoleType.user], [RoleType.manager]],
        [[RoleType.manager, RoleType.user], [RoleType.admin]],
        [[RoleType.user], [RoleType.admin, RoleType.manager]],
        [[RoleType.admin], [RoleType.manager, RoleType.user]],
        [[], [RoleType.manager, RoleType.user]],
    ].forEach(([userRoles, targetRoles]) => {
        it('should not pass when none of `roles` are contained', async () => {
            authServiceSpy.isLoggedIn.and.returnValue(true);
            userServiceSpy.get.and.returnValue({ roles: userRoles } as any);

            const canActivate = await guard.canActivate({ data: { roles: targetRoles } } as any);
            expect(canActivate).toBe(false);
        });
    });
});
