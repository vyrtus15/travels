import { TestBed } from '@angular/core/testing';
import { HttpService } from 'src/app/services/http/http.service';
import { TravelsService } from './travels.service';

describe('TravelsService', () => {
  let service: TravelsService;

  const httpServiceSpy = jasmine.createSpyObj<HttpService>('HttpService', ['get', 'post', 'put', 'delete']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: HttpService, useValue: httpServiceSpy },
      ],
    });
    service = TestBed.inject(TravelsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
