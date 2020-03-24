import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../../interfaces/auth.interface';
import { RoleType, User } from '../../interfaces/user.interface';
import { AuthService } from '../../services/auth/auth.service';
import { LoginService } from '../../services/login/login.service';
import { UserService } from '../../services/user/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm = this.formBuilder.group({
    userName: [null, Validators.required],
    password: [null, Validators.required],
  });

  public invalidCredentials = false;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly loginService: LoginService,
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly router: Router,
  ) { }

  submit() {
    if (!this.loginForm.valid) {
      return;
    }
    this.invalidCredentials = false;

    this.loginService.login(this.loginForm.value)
      .subscribe(
        (auth: Auth) => this.handleSuccessLogin(auth),
        () => this.handleErrorLogin());
  }

  private async handleSuccessLogin(auth: Auth) {
    this.authService.save(auth);

    const user = await this.userService.get();
    const redirectTo = this.getRedirectPath(user);

    this.router.navigate(redirectTo);
  }

  private async handleErrorLogin() {
    this.invalidCredentials = true;
  }

  private getRedirectPath(user: User) {
    if (user.roles.length === 1 && user.roles[0] === RoleType.user) {
      return ['travels', user.id];
    }

    return ['users'];
  }
}
