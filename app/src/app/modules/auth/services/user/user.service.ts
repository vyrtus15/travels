import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/services/http/http.service';
import { User } from '../../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private user: User;

  constructor(
    private readonly httpService: HttpService,
  ) { }

  async get() {
    if (!this.user) {
      this.user = await this.fetchUser();
    }

    return this.user;
  }

  remove() {
    this.user = null;
  }

  private fetchUser() {
    return this.httpService.get('user/me').toPromise() as Promise<User>;
  }
}
