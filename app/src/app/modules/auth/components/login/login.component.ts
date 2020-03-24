import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Auth } from '../../interfaces/auth.interface';
import { AuthService } from '../../services/auth/auth.service';
import { LoginService } from '../../services/login/login.service';

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
  ) { }

  submit() {
    if (!this.loginForm.valid) {
      return;
    }
    this.invalidCredentials = false;

    this.loginService.login(this.loginForm.value)
      .subscribe((user: Auth) => {
        this.authService.save(user);
      }, () => {
        this.invalidCredentials = true;
      });
  }
}
