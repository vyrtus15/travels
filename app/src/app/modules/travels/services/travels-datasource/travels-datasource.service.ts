import { Injectable } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import * as moment from 'moment';
import { merge, Observable, of } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { TravelFilter, TravelResponse } from '../../interfaces/travel.interface';
import { TravelsService } from '../travels/travels.service';

/**
 * Class used to create a source of travels to be displayed for users.
 */
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
        switchMap((change) => {
          const filter = this.buildFilter(change);
          return this.travelsService.get(options.userId, options.paginator.pageIndex + 1, filter);
        }),
        map((data: TravelResponse) => this.travelsService.map(data)),
        catchError(() => of({ items: [], total: 0 })),
      );
  }

  private buildFilter(change) {
    const filter = {} as TravelFilter;

    if (change.destination) {
      filter.destination = change.destination;
    }

    if (change.startDate) {
      filter.startDate = moment(change.startDate).toISOString();
    }

    if (change.endDate) {
      filter.endDate = moment(change.endDate).toISOString();
    }

    return filter;
  }

}
