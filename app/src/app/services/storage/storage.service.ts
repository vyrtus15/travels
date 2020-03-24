import { Injectable } from '@angular/core';
import { LoggerService } from '../logger/logger.service';

/**
 * Class used for persistent storage
 */
@Injectable({
  providedIn: 'root',
  deps: [LoggerService],
  useFactory: (logger) => new StorageService(window.sessionStorage as Storage, logger),
})
export class StorageService {
  constructor(
    private readonly storage: Storage,
    private readonly loggerService: LoggerService,
  ) { }

  set<T>(key: string, data: T) {
    try {
      this.storage.setItem(key, JSON.stringify(data));
    } catch (e) {
      this.loggerService.error(`Error saving to storage ${e.message}`, e);
    }
  }

  get<T>(key: string): T {
    try {
      return JSON.parse(this.storage.getItem(key));
    } catch (e) {
      this.loggerService.error(`Error getting data from storage ${e.message}`, e);
      return null;
    }
  }

}

export interface Storage {
  getItem: <T>(key: string) => T;
  setItem: <T>(key: string, value: T) => void;
}
