import { TestBed } from '@angular/core/testing';
import { HttpService } from 'src/app/services/http/http.service';
import { UsersDatasourceService } from './users-datasource.service';

describe('UsersDatasourceService', () => {
  let service: UsersDatasourceService;

  const httpServiceSpy = jasmine.createSpyObj<HttpService>('HttpService', ['get', 'post', 'put', 'delete']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: HttpService, useValue: httpServiceSpy },
      ],
    });
    service = TestBed.inject(UsersDatasourceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
