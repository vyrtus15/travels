import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { AuthService } from 'src/app/modules/auth/services/auth/auth.service';
import { ConfigService } from '../config/config.service';
import { HttpService } from './http.service';

describe('HttpService', () => {
  let service: HttpService;

  const httpClientSpy = jasmine.createSpyObj<HttpClient>('HttpClient', ['post', 'get', 'put', 'delete']);
  const authServiceSpy = jasmine.createSpyObj<AuthService>('AuthService', ['getToken']);
  const configServiceSpy = jasmine.createSpyObj<ConfigService>('ConfigService', ['get']);

  const baseUrl = 'http://travel/';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: HttpClient, useValue: httpClientSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: ConfigService, useValue: configServiceSpy },
      ],
    });

    configServiceSpy.get.and.returnValue(baseUrl);
    service = TestBed.inject(HttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get base url from config', () => {
    expect(configServiceSpy.get).toHaveBeenCalledWith('api');
  });

  describe('get', () => {
    beforeEach(() => {
      httpClientSpy.get.calls.reset();
      authServiceSpy.getToken.and.returnValue(null);
    });

    it('should build url', () => {
      service.get('path42');

      expect(httpClientSpy.get).toHaveBeenCalledWith(`${baseUrl}path42`, { params: null, headers: {} });
    });

    it('should send query params', () => {
      const query: any = { q: 42 };

      service.get('path42', query);

      expect(httpClientSpy.get).toHaveBeenCalledWith(`${baseUrl}path42`, { params: query, headers: {} });
    });

    it('should add auth header if user has token', () => {
      authServiceSpy.getToken.and.returnValue('42');

      service.get('path42');

      expect(httpClientSpy.get).toHaveBeenCalledWith(`${baseUrl}path42`, { params: null, headers: { Authorization: 'Bearer 42' } });
    });
  });

  describe('post', () => {
    beforeEach(() => {
      httpClientSpy.post.calls.reset();
      authServiceSpy.getToken.and.returnValue(null);
    });

    it('should build url', () => {
      service.post('path42', {});

      expect(httpClientSpy.post).toHaveBeenCalledWith(`${baseUrl}path42`, {}, { params: null, headers: {} });
    });

    it('should send query params', () => {
      const query: any = { q: 42 };

      service.post('path42', {}, query);

      expect(httpClientSpy.post).toHaveBeenCalledWith(`${baseUrl}path42`, {}, { params: query, headers: {} });
    });

    it('should send body', () => {
      const body: any = { q: 42 };

      service.post('path42', body);

      expect(httpClientSpy.post).toHaveBeenCalledWith(`${baseUrl}path42`, body, { params: null, headers: {} });
    });


    it('should add auth header if user has token', () => {
      authServiceSpy.getToken.and.returnValue('42');
      const body: any = { q: 42 };

      service.post('path42', body);

      expect(httpClientSpy.post).toHaveBeenCalledWith(`${baseUrl}path42`, body, { params: null, headers: { Authorization: 'Bearer 42' } });
    });
  });

  describe('put', () => {
    beforeEach(() => {
      httpClientSpy.put.calls.reset();
      authServiceSpy.getToken.and.returnValue(null);
    });

    it('should build url', () => {
      service.put('path42', {});

      expect(httpClientSpy.put).toHaveBeenCalledWith(`${baseUrl}path42`, {}, { params: null, headers: {} });
    });

    it('should send query params', () => {
      const query: any = { q: 42 };

      service.put('path42', {}, query);

      expect(httpClientSpy.put).toHaveBeenCalledWith(`${baseUrl}path42`, {}, { params: query, headers: {} });
    });

    it('should send body', () => {
      const body: any = { q: 42 };

      service.put('path42', body);

      expect(httpClientSpy.put).toHaveBeenCalledWith(`${baseUrl}path42`, body, { params: null, headers: {} });
    });


    it('should add auth header if user has token', () => {
      authServiceSpy.getToken.and.returnValue('42');
      const body: any = { q: 42 };

      service.put('path42', body);

      expect(httpClientSpy.put).toHaveBeenCalledWith(`${baseUrl}path42`, body, { params: null, headers: { Authorization: 'Bearer 42' } });
    });
  });

  describe('delete', () => {
    beforeEach(() => {
      httpClientSpy.delete.calls.reset();
      authServiceSpy.getToken.and.returnValue(null);
    });

    it('should build url', () => {
      service.delete('path42');

      expect(httpClientSpy.delete).toHaveBeenCalledWith(`${baseUrl}path42`, { params: null, headers: {} });
    });

    it('should send query params', () => {
      const query: any = { q: 42 };

      service.delete('path42', query);

      expect(httpClientSpy.delete).toHaveBeenCalledWith(`${baseUrl}path42`, { params: query, headers: {} });
    });

    it('should add auth header if user has token', () => {
      authServiceSpy.getToken.and.returnValue('42');

      service.delete('path42');

      expect(httpClientSpy.delete).toHaveBeenCalledWith(`${baseUrl}path42`, { params: null, headers: { Authorization: 'Bearer 42' } });
    });
  });
});
