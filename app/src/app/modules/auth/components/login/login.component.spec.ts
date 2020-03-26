import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { Auth } from '../../interfaces/auth.interface';
import { RoleType, User } from '../../interfaces/user.interface';
import { AuthService } from '../../services/auth/auth.service';
import { LoginService } from '../../services/login/login.service';
import { UserService } from '../../services/user/user.service';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  const authServiceSpy = jasmine.createSpyObj<AuthService>('AuthService', ['save']);
  const userServiceSpy = jasmine.createSpyObj<UserService>('UserService', ['get']);
  const loginServiceSpy = jasmine.createSpyObj<LoginService>('LoginService', ['login']);
  const routerSpy = jasmine.createSpyObj<Router>('Router', ['navigate']);

  const auth: Auth = { userId: '42', accessToken: 'token' };
  const credentials = { credentialsName: 'user', password: 'pass' } as any;

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
        { provide: LoginService, useValue: loginServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: UserService, useValue: userServiceSpy },
        { provide: Router, useValue: routerSpy },
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    loginServiceSpy.login.calls.reset();
    userServiceSpy.get.calls.reset();
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });


  it('should not login if form is not valid', async () => {
    component.loginForm = { valid: false } as any;

    await component.submit();

    expect(loginServiceSpy.login).not.toHaveBeenCalled();
  });

  it('should login on valid submit', async () => {
    component.loginForm = { valid: true, value: credentials } as any;

    loginServiceSpy.login.and.returnValue(of({}));
    userServiceSpy.get.and.returnValue(Promise.resolve({ roles: [] } as User));

    await component.submit();

    expect(loginServiceSpy.login).toHaveBeenCalledWith(credentials);
  });

  it('should save auth after success login', async () => {
    component.loginForm = { valid: true, value: credentials } as any;

    loginServiceSpy.login.and.returnValue(of(auth));
    userServiceSpy.get.and.returnValue(Promise.resolve({ roles: [] } as User));

    await component.submit();

    expect(authServiceSpy.save).toHaveBeenCalledWith(auth);
  });

  it('should get user after success login', async () => {
    component.loginForm = { valid: true, value: credentials } as any;

    loginServiceSpy.login.and.returnValue(of(auth));
    userServiceSpy.get.and.returnValue(Promise.resolve({ roles: [] } as User));

    await component.submit();

    expect(userServiceSpy.get).toHaveBeenCalled();
  });

  it('should navigate to users if roles not user', async () => {
    component.loginForm = { valid: true, value: credentials } as any;

    loginServiceSpy.login.and.returnValue(of(auth));
    userServiceSpy.get.and.returnValue(Promise.resolve({ roles: [RoleType.admin, RoleType.manager] } as User));

    await component.submit();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['users']);
  });

  it('should navigate to travels if roles is user', async () => {
    component.loginForm = { valid: true, value: credentials } as any;

    loginServiceSpy.login.and.returnValue(of(auth));
    userServiceSpy.get.and.returnValue(Promise.resolve({ id: auth.userId, roles: [RoleType.user] } as User));

    await component.submit();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['travels', auth.userId]);
  });

});
