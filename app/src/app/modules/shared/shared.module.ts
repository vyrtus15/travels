import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { LogoutComponent } from './components/logout/logout.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
  ],
  declarations: [
    PageNotFoundComponent,
    LogoutComponent,
  ],
  exports: [
    PageNotFoundComponent,
    LogoutComponent,
  ],
})
export class SharedModule { }
