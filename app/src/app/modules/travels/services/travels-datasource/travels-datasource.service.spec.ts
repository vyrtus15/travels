import { TestBed } from '@angular/core/testing';
import { HttpService } from 'src/app/services/http/http.service';
import { TravelsDatasourceService } from './travels-datasource.service';

describe('TravelsDatasourceService', () => {
  let service: TravelsDatasourceService;

  const httpServiceSpy = jasmine.createSpyObj<HttpService>('HttpService', ['get', 'post', 'put', 'delete']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: HttpService, useValue: httpServiceSpy },
      ],
    });
    service = TestBed.inject(TravelsDatasourceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
