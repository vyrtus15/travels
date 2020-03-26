import { TestBed } from '@angular/core/testing';

import { UsersService } from './users.service';
import { HttpService } from 'src/app/services/http/http.service';
import { UserItem } from '../../interfaces/users.interface';

describe('UsersService', () => {
  let service: UsersService;

  const httpServiceSpy = jasmine.createSpyObj<HttpService>('HttpService', ['get', 'post', 'put', 'delete']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: HttpService, useValue: httpServiceSpy },
      ],
    });
    service = TestBed.inject(UsersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get users using defaults', () => {
    service.get();

    expect(httpServiceSpy.get).toHaveBeenCalledWith('user?page=1', {});
  });

  it('should get users using custom page', () => {
    service.get(42);

    expect(httpServiceSpy.get).toHaveBeenCalledWith('user?page=42', {});
  });

  it('should get users using filter', () => {
    service.get(42, { firstName: 'rp' });

    expect(httpServiceSpy.get).toHaveBeenCalledWith('user?page=42', { firstName: 'rp' });
  });

  it('should update user', () => {
    const updated = { firstName: 'rp', lastName: '42' } as UserItem;

    service.update('42', updated);

    expect(httpServiceSpy.put).toHaveBeenCalledWith('user/42', updated);
  });

  it('should delete user by id', () => {
    service.delete('42');

    expect(httpServiceSpy.delete).toHaveBeenCalledWith('user/42');
  });
});
