import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { RegisterService } from '../../services/register/register.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm = this.formBuilder.group({
    userName: [null, Validators.required],
    firstName: [null, Validators.required],
    lastName: [null, Validators.required],
    password: [null, Validators.required],
  });

  public registerError = false;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly registerService: RegisterService,
    private readonly router: Router,
    private readonly snackBar: MatSnackBar,
  ) { }

  submit() {
    if (!this.registerForm.valid) {
      return;
    }
    this.registerError = false;

    this.registerService.register(this.registerForm.value)
      .subscribe(() => {
        this.snackBar.open('Account created, please log in.', null, { duration: 3500 });
        this.router.navigate(['/']);
      }, () => {
        this.registerError = true;
      });
  }
}
