import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/services/http/http.service';
import { Login } from '../../interfaces/login.interface';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor(
    private readonly httpService: HttpService,
    private readonly authService: AuthService,
  ) { }

  public login(credentials: Login) {
    return this.httpService.post('auth/login', credentials);
  }

  public logout() {
    this.authService.save(null);
  }
}
