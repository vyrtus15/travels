import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditUserComponent } from './components/edit-user/edit-user.component';
import { UsersComponent } from './components/users/users.component';

const usersRoutes: Routes = [
  {
    path: '',
    component: UsersComponent
  },
  {
    path: ':userId/edit',
    component: EditUserComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(usersRoutes),
  ],
  exports: [
    RouterModule,
  ]
})
export class UsersRoutingModule { }
