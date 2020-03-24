import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { RoleType, User } from '../modules/auth/interfaces/user.interface';
import { AuthService } from '../modules/auth/services/auth/auth.service';
import { UserService } from '../modules/auth/services/user/user.service';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly router: Router,
  ) { }

  async canActivate(next: ActivatedRouteSnapshot): Promise<boolean> {

    const requiredRoles = next.data.roles;
    if (this.isEmpty(requiredRoles)) {
      return true;
    }

    if (!this.authService.isLoggedIn()) {
      this.redirectNoAccess();
      return false;
    }

    const user: User = await this.userService.get();
    if (!user || !Array.isArray(user.roles)) {
      this.redirectNoAccess();
      return false;
    }

    const hasRoleAccess = this.matchRoles(requiredRoles, user.roles);
    if (!hasRoleAccess) {
      this.redirectNoAccess();
      return false;
    }

    return hasRoleAccess;
  }

  private matchRoles(givenRoles: RoleType[], userRoles: RoleType[]) {
    if (this.isEmpty(givenRoles)) {
      return true;
    }

    return givenRoles.some(allowedRole => userRoles.indexOf(allowedRole) !== -1);
  }

  private isEmpty<T>(array: T[]) {
    return !Array.isArray(array) || array.length === 0;
  }

  private redirectNoAccess() {
    this.router.navigate(['']);
  }
}
