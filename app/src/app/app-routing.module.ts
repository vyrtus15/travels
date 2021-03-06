import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleGuard } from './guards/role.guard';
import { RoleType } from './modules/auth/interfaces/user.interface';
import { PageNotFoundComponent } from './modules/shared/components/page-not-found/page-not-found.component';

const appRoutes: Routes = [
  {
    path: '',
    loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule),
  },
  {
    path: 'travels',
    loadChildren: () => import('./modules/travels/travels.module').then(m => m.TravelsModule),
    canActivate: [RoleGuard],
    data: {
      roles: [RoleType.user, RoleType.admin],
    },
  },
  {
    path: 'users',
    loadChildren: () => import('./modules/users/users.module').then(m => m.UsersModule),
    canActivate: [RoleGuard],
    data: {
      roles: [RoleType.manager, RoleType.admin],
    },
  },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes),
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
