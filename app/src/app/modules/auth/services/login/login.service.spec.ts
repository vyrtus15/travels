import { TestBed } from '@angular/core/testing';
import { HttpService } from 'src/app/services/http/http.service';
import { Login } from '../../interfaces/login.interface';
import { LoginService } from './login.service';

describe('LoginService', () => {
  let service: LoginService;
  const httpServiceSpy = jasmine.createSpyObj<HttpService>('HttpService', ['post']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: HttpService, useValue: httpServiceSpy },
      ]
    });
    service = TestBed.inject(LoginService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call login with credentials', async () => {
    const user: Login = { userName: '4', password: '2' };

    await service.login(user);

    expect(httpServiceSpy.post).toHaveBeenCalledWith('auth/login', user);
  });
});
