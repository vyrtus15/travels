import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { UserItem } from '../../interfaces/users.interface';
import { UsersService } from '../../services/users/users.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {
  public item: UserItem;

  editUserForm: FormGroup;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly usersService: UsersService,
    private readonly matSnackBar: MatSnackBar,
  ) {
    this.item = this.router.getCurrentNavigation()?.extras?.state as UserItem;
  }

  ngOnInit() {
    if (!this.item) {
      this.router.navigate(['users']);
      return;
    }

    this.editUserForm = this.formBuilder.group({
      firstName: [this.item.firstName, Validators.required],
      lastName: [this.item.lastName, Validators.required],
    });
  }

  submit() {
    if (!this.editUserForm.valid) {
      return;
    }

    const userId = this.activatedRoute.snapshot.paramMap.get('userId');

    this.usersService.update(userId, this.editUserForm.value)
      .subscribe(() => this.handleSuccess());
  }

  back() {
    this.router.navigate(['users']);
  }

  private handleSuccess() {
    this.matSnackBar.open('User updated', null, { duration: 2500 });
    this.back();
  }

}
