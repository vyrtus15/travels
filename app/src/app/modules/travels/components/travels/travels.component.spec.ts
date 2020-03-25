import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { TravelsService } from '../../services/travels/travels.service';
import { TravelsComponent } from './travels.component';
import { TravelsDatasourceService } from '../../services/travels-datasource/travels-datasource.service';

describe('TravelsComponent', () => {
  let component: TravelsComponent;
  let fixture: ComponentFixture<TravelsComponent>;

  const routerSpy = jasmine.createSpyObj<Router>('Router', ['navigate', 'getCurrentNavigation']);
  const travelsServiceSpy = jasmine.createSpyObj<TravelsService>('TravelsService', ['get', 'delete']);
  const travelsDatasourceServiceSpy = jasmine.createSpyObj<TravelsDatasourceService>('TravelsDatasourceService', ['create']);
  const matSnackBarSpy = jasmine.createSpyObj<MatDialog>('MatDialog', ['open']);

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
      declarations: [TravelsComponent],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: TravelsService, useValue: travelsServiceSpy },
        { provide: TravelsDatasourceService, useValue: travelsDatasourceServiceSpy },
        { provide: MatDialog, useValue: matSnackBarSpy },
        {
          provide: ActivatedRoute, useValue: {
            snapshot: {
              paramMap: new Map([['userId', '42']]),
            },
          },
        },
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TravelsComponent);
    component = fixture.componentInstance;
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
