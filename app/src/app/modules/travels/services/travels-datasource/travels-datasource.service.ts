import { Injectable } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import * as moment from 'moment';
import { merge, Observable, of } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { TravelResponse, TravelsItem } from '../../interfaces/travel.interface';
import { TravelsService } from '../travels/travels.service';

@Injectable({
  providedIn: 'root'
})
export class TravelsDatasourceService {

  constructor(
    private readonly travelsService: TravelsService,
  ) { }

  create(options: {
    sources: Observable<any>[],
    paginator: MatPaginator,
    userId: string
  }) {
    return merge(...options.sources)
      .pipe(
        startWith({}),
        switchMap(() => this.travelsService.get(options.userId, options.paginator.pageIndex + 1)),
        map((data: TravelResponse) => ({
          items: data.items.map(item => ({
            ...item,
            startDate: this.prettyDate(item.startDate),
            endDate: this.prettyDate(item.endDate),
            daysLeft: this.countDaysTillTrip(item)
          })),
          total: data.total,
        })),
        catchError(() => {
          return of({ items: [], total: 0 });
        }),
      );
  }


  private countDaysTillTrip(trip: TravelsItem) {
    const tripDate = moment(trip.startDate);
    const today = moment();

    const daysLeft = tripDate.diff(today, 'days');
    return daysLeft >= 0 ? daysLeft : 0;
  }

  private prettyDate(date: Date) {
    return moment(date).format('LLL');
  }
}
