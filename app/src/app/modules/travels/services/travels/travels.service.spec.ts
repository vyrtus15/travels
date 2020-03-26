import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { HttpService } from 'src/app/services/http/http.service';
import { TravelResponse, TravelsItem } from '../../interfaces/travel.interface';
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

  it('should get travels using defaults', () => {
    service.get('42');

    expect(httpServiceSpy.get).toHaveBeenCalledWith('user/42/travels?page=1', {});
  });

  it('should get travels using custom page', () => {
    service.get('42', 42);

    expect(httpServiceSpy.get).toHaveBeenCalledWith('user/42/travels?page=42', {});
  });

  it('should get travels using filters', () => {
    service.get('42', 42, { destination: 'rp' });

    expect(httpServiceSpy.get).toHaveBeenCalledWith('user/42/travels?page=42', { destination: 'rp' });
  });

  it('should update travel', () => {
    const updated = { destination: 'rp' } as TravelsItem;

    service.update('4', '2', updated);

    expect(httpServiceSpy.put).toHaveBeenCalledWith('user/4/travels/2', updated);
  });

  it('should create travel', () => {
    const travel = { destination: 'rp' } as TravelsItem;

    service.create('4', travel);

    expect(httpServiceSpy.post).toHaveBeenCalledWith('user/4/travels', travel);
  });

  it('should delet travel by id', () => {
    service.delete('4', '2');

    expect(httpServiceSpy.delete).toHaveBeenCalledWith('user/4/travels/2');
  });

  it('should get print travels ', () => {
    httpServiceSpy.get.and.returnValue(of({}));

    service.getPrintDetails('4');

    expect(httpServiceSpy.get).toHaveBeenCalledWith('user/4/travels?page=1&limit=100', jasmine.anything());
  });

  it('should add daysLeft for travels', () => {
    const data = {
      items: [{
        startDate: new Date('12/12/2020'),
        endDate: new Date('22/12/2020'),
      }],
      total: 1,
    } as TravelResponse;

    const response = service.map(data);

    expect(response.items.every((item) => typeof item.daysLeft !== 'undefined')).toEqual(true);
  });

  it('should format startDate & endDate for travels', () => {
    const data = {
      items: [{
        startDate: new Date('12/12/2020'),
        endDate: new Date('12/22/2020'),
      }],
      total: 1,
    } as TravelResponse;

    const response = service.map(data);

    expect(response.items.every((item) => item.startDate === 'December 12, 2020' && item.endDate === 'December 22, 2020')).toEqual(true);
  });
});
