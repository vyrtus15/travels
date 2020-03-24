import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  private readonly baseUrl = environment.api;

  constructor(
    private readonly http: HttpClient,
  ) { }

  register(user) {
    const url = `${this.baseUrl}auth/register`;
    return this.http.post(url, user);
  }
}
