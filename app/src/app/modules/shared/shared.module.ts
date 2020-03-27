import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { LogoutComponent } from './components/logout/logout.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatToolbarModule,
  ],
  declarations: [
    PageNotFoundComponent,
    LogoutComponent,
    HeaderComponent,
    FooterComponent,
  ],
  exports: [
    PageNotFoundComponent,
    LogoutComponent,
    HeaderComponent,
    FooterComponent,
  ],
})
export class SharedModule { }
