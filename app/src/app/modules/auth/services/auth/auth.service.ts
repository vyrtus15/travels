import { Injectable } from '@angular/core';
import { Auth } from '../../interfaces/auth.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth: Auth = {} as Auth;

  save(user: Auth) {
    this.auth = user;
  }

  getToken() {
    return this.auth.accessToken;
  }

  getUserId() {
    return this.auth.userId;
  }

  isLoggedIn() {
    return !!this.auth.accessToken;
  }

}
