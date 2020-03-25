import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/services/http/http.service';
import { TravelsItem } from '../../interfaces/travel.interface';

@Injectable({
  providedIn: 'root'
})
export class TravelsService {

  constructor(
    private readonly httpService: HttpService,
  ) { }

  get(userId: string, page: number = 1, filter: any = {}) {
    return this.httpService.get(`user/${userId}/travels?page=${page}`, filter);
  }

  create(userId: string, travel: TravelsItem) {
    return this.httpService.post(`user/${userId}/travels`, travel);
  }

  update(userId: string, travelId: string, travel: TravelsItem) {
    return this.httpService.put(`user/${userId}/travels/${travelId}`, travel);
  }

  delete(userId: string, travelId: string) {
    return this.httpService.delete(`user/${userId}/travels/${travelId}`);
  }
}
