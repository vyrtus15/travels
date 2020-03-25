import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { UserItem, UsersResponse } from '../../interfaces/users.interface';
import { UsersDatasourceService } from '../../services/users-datasource/users-datasource.service';
import { UsersService } from '../../services/users/users.service';
import { DeleteUserComponent } from '../delete-user/delete-user.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns = ['userName', 'firstName', 'lastName', 'view', 'edit', 'remove'];

  items: UserItem[];
  totalItems = 0;

  private forceUpdate$ = new Subject();

  constructor(
    private readonly usersService: UsersService,
    private readonly usersDatasourceService: UsersDatasourceService,
    private readonly router: Router,
    private readonly matDialog: MatDialog,
  ) { }

  ngAfterViewInit() {
    this.usersDatasourceService.create({
      sources: [this.paginator.page, this.forceUpdate$],
      paginator: this.paginator,
    })
      .subscribe(({ items, total }: UsersResponse) => {
        this.items = items;
        this.totalItems = total;
      });
  }

  view(item: UserItem) {
    this.router.navigate(['travels', item.id]);
  }

  edit(item: UserItem) {
    this.router.navigate(['users', item.id, 'edit'], { state: item });
  }

  remove(item: UserItem) {
    const dialogRef = this.matDialog.open(DeleteUserComponent, {
      width: '400px',
      data: { user: item },
    });

    dialogRef.afterClosed()
      .subscribe(result => {
        if (!result) {
          return;
        }

        this.usersService.delete(item.id)
          .subscribe(() => this.forceUpdate$.next());
      });
  }

}
