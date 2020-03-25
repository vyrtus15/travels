import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { UsersDatasourceService } from '../../services/users-datasource/users-datasource.service';
import { UsersService } from '../../services/users/users.service';
import { UsersComponent } from './users.component';

describe('UsersComponent', () => {
  let component: UsersComponent;
  let fixture: ComponentFixture<UsersComponent>;

  const routerSpy = jasmine.createSpyObj<Router>('Router', ['navigate']);
  const usersServiceSpy = jasmine.createSpyObj<UsersService>('UsersService', ['get', 'delete']);
  const usersDatasourceServiceSpy = jasmine.createSpyObj<UsersDatasourceService>('UsersDatasourceService', ['create']);
  const matDialogSpy = jasmine.createSpyObj<MatDialog>('MatDialog', ['open']);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatTableModule,
        MatPaginatorModule,
        MatButtonModule,
        MatInputModule,
        MatIconModule,
        MatDialogModule,
      ],
      declarations: [UsersComponent],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: UsersService, useValue: usersServiceSpy },
        { provide: UsersDatasourceService, useValue: usersDatasourceServiceSpy },
        { provide: MatDialog, useValue: matDialogSpy },
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersComponent);
    component = fixture.componentInstance;
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
