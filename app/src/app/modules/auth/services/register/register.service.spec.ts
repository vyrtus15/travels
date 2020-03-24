import { TestBed } from '@angular/core/testing';
import { HttpService } from 'src/app/services/http/http.service';
import { Register } from '../../interfaces/register.interface';
import { RegisterService } from './register.service';

describe('RegisterService', () => {
  let service: RegisterService;
  const httpServiceSpy = jasmine.createSpyObj<HttpService>('HttpService', ['post']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{
        provide: HttpService,
        useValue: httpServiceSpy,
      }]
    });

    service = TestBed.inject(RegisterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call http service', async () => {
    const user: Register = { firstName: '42', lastName: '42', userName: '4', password: '2' };

    await service.register(user);

    expect(httpServiceSpy.post).toHaveBeenCalledWith('auth/register', user);
  });
});
