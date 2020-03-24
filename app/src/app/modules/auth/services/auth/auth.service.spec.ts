import { TestBed } from '@angular/core/testing';
import { StorageService } from 'src/app/services/storage/storage.service';
import { Auth } from '../../interfaces/auth.interface';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  const storageServiceSpy = jasmine.createSpyObj('StorageService', ['get', 'set']);

  const mockAuth: Auth = { userId: '42', accessToken: '4242' };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: StorageService, useValue: storageServiceSpy },
      ],
    });
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get auth from storage on init', () => {
    expect(storageServiceSpy.get).toHaveBeenCalled();
  });

  describe('save', () => {
    it('should save auth to storage', () => {
      service.save(mockAuth);

      expect(storageServiceSpy.set).toHaveBeenCalledWith('app-auth', mockAuth);
    });
  });

  describe('getToken', () => {
    it('should return undefined if not authenticated', () => {
      expect(service.getToken()).toEqual(undefined);
    });

    it('should return token if authenticated', () => {
      service.save(mockAuth);

      expect(service.getToken()).toEqual(mockAuth.accessToken);
    });
  });

  describe('getUserId', () => {
    it('should return undefined if not authenticated', () => {
      expect(service.getUserId()).toEqual(undefined);

    });

    it('should return userId if authenticated', () => {
      service.save(mockAuth);

      expect(service.getUserId()).toEqual(mockAuth.userId);
    });
  });

  describe('isLoggedIn', () => {
    it('should return if authenticated', () => {
      service.save(mockAuth);

      expect(service.isLoggedIn()).toEqual(true);
    });

    it('should return if not authenticated', () => {
      expect(service.isLoggedIn()).toEqual(false);
    });
  });

});
