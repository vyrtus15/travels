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
        map((data: TravelResponse) => this.travelsService.map(data)),
        catchError(() => {
          return of({ items: [], total: 0 });
        }),
      );
  }

}
