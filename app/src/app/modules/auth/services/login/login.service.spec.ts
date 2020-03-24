import { TestBed } from '@angular/core/testing';
import { HttpService } from 'src/app/services/http/http.service';
import { Login } from '../../interfaces/login.interface';
import { AuthService } from '../auth/auth.service';
import { LoginService } from './login.service';

describe('LoginService', () => {
  let service: LoginService;
  const httpServiceSpy = jasmine.createSpyObj<HttpService>('HttpService', ['post']);
  const authServiceSpy = jasmine.createSpyObj<AuthService>('AuthService', ['save']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: HttpService, useValue: httpServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
      ]
    });
    service = TestBed.inject(LoginService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call http service', async () => {
    const user: Login = { userName: '4', password: '2' };

    await service.login(user);

    expect(httpServiceSpy.post).toHaveBeenCalledWith('auth/login', user);
  });

  it('should call remove auth on logout', async () => {
    await service.logout();
    expect(authServiceSpy.save).toHaveBeenCalledWith(null);
  });

});
