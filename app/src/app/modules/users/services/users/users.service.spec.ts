import { TestBed } from '@angular/core/testing';

import { UsersService } from './users.service';
import { HttpService } from 'src/app/services/http/http.service';

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
});
