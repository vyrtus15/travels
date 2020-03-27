import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpService } from 'src/app/services/http/http.service';
import { MappedTravels, TravelResponse, TravelsItem } from '../../interfaces/travel.interface';

/**
 * Class used to perform travels actions & all related operations.
 */
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

  getPrintDetails(userId: string): Observable<MappedTravels> {
    return this.httpService.get(`user/${userId}/travels?page=1&limit=100`, {
      endDate: moment().add(1, 'month').toISOString(),
    }).pipe(
      map((data: TravelResponse) => this.map(data)),
    );
  }

  print() {
    window.print();
  }

  public map(data: TravelResponse): MappedTravels {
    return {
      items: data.items.map(item => ({
        ...item,
        daysLeft: this.countDaysTillTrip(item),
        startDate: this.prettyDate(item.startDate as Date),
        endDate: this.prettyDate(item.endDate as Date),
      })),
      total: data.total,
    };
  }

  private countDaysTillTrip(trip: TravelsItem) {
    const tripDate = moment(trip.startDate);
    const today = moment();

    const daysLeft = tripDate.diff(today, 'days');
    return daysLeft >= 0 ? daysLeft : 0;
  }

  private prettyDate(date: Date) {
    return moment(date).format('LL');
  }
}
