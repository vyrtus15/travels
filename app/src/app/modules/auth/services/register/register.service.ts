import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/services/http/http.service';
import { Register } from '../../interfaces/register.interface';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(
    private readonly httpService: HttpService,
  ) { }

  register(user: Register) {
    return this.httpService.post('auth/register', user);
  }
}
