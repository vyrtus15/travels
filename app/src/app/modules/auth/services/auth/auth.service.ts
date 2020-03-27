import { Injectable } from '@angular/core';
import { StorageService } from '../../../../services/storage/storage.service';
import { Auth } from '../../interfaces/auth.interface';

/**
 * Class used to store current user authentication  (accessToken)
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly authKey = 'app-auth';
  private auth: Auth;

  constructor(
    private readonly storage: StorageService,
  ) {
    this.auth = this.storage.get<Auth>(this.authKey);
  }

  save(user: Auth) {
    this.auth = user;
    this.storage.set(this.authKey, user);
  }

  getToken() {
    return this.auth && this.auth.accessToken;
  }

  getUserId() {
    return this.auth && this.auth.userId;
  }

  isLoggedIn() {
    return !!(this.auth && this.auth.accessToken);
  }

  logout() {
    this.save(null);
  }
}
