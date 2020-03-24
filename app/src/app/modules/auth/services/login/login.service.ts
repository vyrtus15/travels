import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Login } from '../../interfaces/login.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private readonly baseUrl = environment.api;

  constructor(
    private readonly http: HttpClient,
  ) { }

  public login(credentials: Login) {
    const url = `${this.baseUrl}auth/login`;
    return this.http.post(url, credentials);
  }
}
