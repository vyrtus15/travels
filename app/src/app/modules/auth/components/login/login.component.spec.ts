import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';

import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth/auth.service';
import { UserService } from '../../services/user/user.service';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login/login.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  const authServiceSpy = jasmine.createSpyObj<AuthService>('AuthService', ['save']);
  const userServiceSpy = jasmine.createSpyObj<UserService>('UserService', ['get']);
  const loginServiceSpy = jasmine.createSpyObj<LoginService>('LoginService', ['login']);
  const routerSpy = jasmine.createSpyObj<Router>('Router', ['navigate']);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [
        NoopAnimationsModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatCardModule,
        MatInputModule,
        MatRadioModule,
        MatSelectModule,
      ],
      providers: [
        { provide: LoginService, useValue: authServiceSpy },
        { provide: AuthService, useValue: userServiceSpy },
        { provide: UserService, useValue: loginServiceSpy },
        { provide: Router, useValue: routerSpy },
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
