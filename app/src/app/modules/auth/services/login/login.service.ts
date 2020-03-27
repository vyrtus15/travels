import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/services/http/http.service';
import { Login } from '../../interfaces/login.interface';

/**
 * Class used to perform login operation & all related stuffs.
 */
@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor(
    private readonly httpService: HttpService,
  ) { }

  public login(credentials: Login) {
    return this.httpService.post('auth/login', credentials);
  }
}
