import { Injectable } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { merge, Observable, of } from 'rxjs';
import { catchError, startWith, switchMap } from 'rxjs/operators';
import { UsersService } from '../users/users.service';

@Injectable({
  providedIn: 'root'
})
export class UsersDatasourceService {

  constructor(
    private readonly usersService: UsersService,
  ) { }

  create(options: {
    sources: Observable<any>[],
    paginator: MatPaginator,
  }) {
    return merge(...options.sources)
      .pipe(
        startWith({}),
        switchMap(() => this.usersService.get(options.paginator.pageIndex + 1)),
        catchError(() => of({ items: [], total: 0 })),
      );
  }

}
