import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/services/http/http.service';
import { UserItem } from '../../interfaces/users.interface';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(
    private readonly httpService: HttpService,
  ) { }

  get(page: number = 1, filter: any = {}) {
    return this.httpService.get(`user?page=${page}`, filter);
  }

  update(userId: string, user: UserItem) {
    return this.httpService.put(`user/${userId}`, user);
  }

  delete(userId: string) {
    return this.httpService.delete(`user/${userId}`);
  }

}
