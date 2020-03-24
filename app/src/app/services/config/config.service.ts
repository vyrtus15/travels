import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

/**
 * Class used to retrive config from environment
 */
@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  get(key: string) {
    return environment[key];
  }
}
