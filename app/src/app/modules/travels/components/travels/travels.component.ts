import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { DisplayTravel, MappedTravels, TravelFilter } from '../../interfaces/travel.interface';
import { TravelsDatasourceService } from '../../services/travels-datasource/travels-datasource.service';
import { TravelsService } from '../../services/travels/travels.service';
import { DeleteTravelComponent } from '../delete-travel/delete-travel.component';

@Component({
  selector: 'app-travels',
  templateUrl: './travels.component.html',
  styleUrls: ['./travels.component.scss']
})
export class TravelsComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns = ['destination', 'startDate', 'endDate', 'daysLeft', 'comment', 'edit', 'remove'];
  printColumns = ['destination', 'startDate', 'endDate', 'daysLeft', 'comment'];

  items: DisplayTravel[];
  totalItems = 0;

  userId: string;

  printInfo: DisplayTravel[];

  filter: TravelFilter = {
    destination: null,
    startDate: null,
    endDate: null,
  };

  private filter$ = new Subject();
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
      sources: [this.paginator.page, this.filter$, this.forceUpdate$],
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

  filterUpdate(key: string, value) {
    this.filter[key] = value;
  }

  applyFilter() {
    this.filter$.next(this.filter);
  }

  print() {
    this.travelsService.getPrintDetails(this.userId)
      .subscribe(({ items }: MappedTravels) => this.handlePrintFetch(items));
  }

  private handlePrintFetch(items: DisplayTravel[]) {
    this.printInfo = items;
    setTimeout(() => {
      window.print();
    });
  }

}
