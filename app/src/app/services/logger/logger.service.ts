import { Injectable } from '@angular/core';

/**
 * Class used for logging purposes
 */
@Injectable({
  providedIn: 'root'
})
export class LoggerService {

  info(...args: any[]) {
    console.log(args);
  }

  error(...args: any[]) {
    console.log(args);
  }
}
