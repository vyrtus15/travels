import { TestBed } from '@angular/core/testing';

import { StorageService, Storage } from './storage.service';
import { LoggerService } from '../logger/logger.service';

describe('StorageService', () => {
  let service: StorageService;

  const storageSpy = jasmine.createSpyObj<Storage>('Storage', ['setItem', 'getItem']);
  const loggerServiceSpy = jasmine.createSpyObj<LoggerService>('LoggerService', ['error']);

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = new StorageService(storageSpy, loggerServiceSpy);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('set', () => {

    it('should save item to storage', () => {
      service.set('key', '42');

      expect(storageSpy.setItem).toHaveBeenCalledWith('key', JSON.stringify('42'));
    });

    it('should log error when save failed', () => {
      const circular = { x: null };
      circular.x = circular;

      service.set('key', circular);

      expect(loggerServiceSpy.error).toHaveBeenCalled();
    });
  });

  describe('get', () => {

    it('should get item from storage', () => {
      service.get('key');

      expect(storageSpy.getItem).toHaveBeenCalledWith('key');
    });

    it('should return item from storage', () => {
      storageSpy.getItem.and.returnValue(JSON.stringify('42'));

      const value = service.get('key');

      expect(value).toEqual('42');
    });

    it('should not return item from storage if parse failed', () => {
      storageSpy.getItem.and.returnValue({ k: 42 });

      const value = service.get('key');

      expect(value).toEqual(null);
    });

    it('should log error when parse failed', () => {
      storageSpy.getItem.and.returnValue({ k: 42 });

      service.get('key');

      expect(loggerServiceSpy.error).toHaveBeenCalled();
    });
  });

});
