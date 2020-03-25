import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { merge, of, Subject } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { DisplayTravel, TravelResponse, TravelsItem } from '../../interfaces/travel.interface';
import { TravelsService } from '../../services/travels/travels.service';
import { DeleteTravelComponent } from '../delete-travel/delete-travel.component';
import { TravelsDatasourceService } from '../../services/travels-datasource/travels-datasource.service';

@Component({
  selector: 'app-travels',
  templateUrl: './travels.component.html',
  styleUrls: ['./travels.component.scss']
})
export class TravelsComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;

  items: DisplayTravel[];
  totalItems = 0;

  userId: string;
  displayedColumns = ['destination', 'startDate', 'endDate', 'daysLeft', 'comment', 'edit', 'remove'];

  private forceUpdate$ = new Subject();

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly travelsService: TravelsService,
    private readonly travelsDatasourceService: TravelsDatasourceService,
    private readonly router: Router,
    private readonly matDialog: MatDialog,
  ) {
    this.userId = this.activatedRoute.snapshot.paramMap.get('userId');
  }

  ngAfterViewInit() {
    this.travelsDatasourceService.create({
      sources: [this.paginator.page, this.forceUpdate$],
      paginator: this.paginator,
      userId: this.userId,
    })
      .subscribe(({ items, total }: { items: DisplayTravel[], total: number }) => {
        this.items = items;
        this.totalItems = total;
      });
  }

  edit(item: DisplayTravel) {
    this.router.navigate(['travels', this.userId, 'edit', item.id], { state: item });
  }

  add() {
    this.router.navigate(['travels', this.userId, 'add']);
  }

  remove(item: DisplayTravel) {
    const dialogRef = this.matDialog.open(DeleteTravelComponent, {
      width: '400px',
      data: { travel: item },
    });

    dialogRef.afterClosed()
      .subscribe(result => {
        if (!result) {
          return;
        }

        this.travelsService.delete(this.userId, item.id)
          .subscribe(() => this.forceUpdate$.next());
      });
  }

  print() {

  }

}
