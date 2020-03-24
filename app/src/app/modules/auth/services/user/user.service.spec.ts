import { TestBed } from '@angular/core/testing';
import { HttpService } from 'src/app/services/http/http.service';
import { UserService } from './user.service';
import { of } from 'rxjs';
import { User } from '../../interfaces/user.interface';

describe('UserService', () => {
  let service: UserService;

  const httpServiceSpy = jasmine.createSpyObj<HttpService>('HttpService', ['get']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{
        provide: HttpService,
        useValue: httpServiceSpy,
      }],
    });
    service = TestBed.inject(UserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch user', async () => {
    httpServiceSpy.get.and.returnValue(of({}));

    await service.get();

    expect(httpServiceSpy.get).toHaveBeenCalledWith('user/me');
  });

  it('should not fetch user if already saved', async () => {
    httpServiceSpy.get.and.returnValue(of({}));

    await service.get();
    httpServiceSpy.get.calls.reset();

    await service.get();

    expect(httpServiceSpy.get).not.toHaveBeenCalled();
  });

  it('should return user', async () => {
    const user = { id: '42' } as User;
    httpServiceSpy.get.and.returnValue(of(user));

    const response = await service.get();

    expect(response).toEqual(user);
  });
});
