import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { DisplayTravel } from '../../interfaces/travel.interface';
import { TravelsDatasourceService } from '../../services/travels-datasource/travels-datasource.service';
import { TravelsService } from '../../services/travels/travels.service';
import { TravelsComponent } from './travels.component';

describe('TravelsComponent', () => {
  let component: TravelsComponent;
  let fixture: ComponentFixture<TravelsComponent>;

  const routerSpy = jasmine.createSpyObj<Router>('Router', ['navigate']);
  const travelsServiceSpy = jasmine.createSpyObj<TravelsService>('TravelsService', ['get', 'delete', 'getPrintDetails', 'print']);
  const travelsDatasourceServiceSpy = jasmine.createSpyObj<TravelsDatasourceService>('TravelsDatasourceService', ['create']);
  const matSnackBarSpy = jasmine.createSpyObj<MatDialog>('MatDialog', ['open']);

  const userId = '42';

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatTableModule,
        MatPaginatorModule,
        MatButtonModule,
        MatInputModule,
        MatIconModule,
        MatDialogModule,
        MatDatepickerModule,
        MatNativeDateModule,
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
    component.userId = userId;
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate on edit', () => {
    const travel = { id: '4242' } as DisplayTravel;

    component.edit(travel);

    expect(routerSpy.navigate).toHaveBeenCalledWith(['travels', userId, 'edit', travel.id], { state: travel });
  });

  it('should navigate on add', () => {
    component.add();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['travels', userId, 'add']);
  });

  it('should get print details on print', fakeAsync(() => {
    travelsServiceSpy.getPrintDetails.and.returnValue(of({} as any));

    component.print();

    expect(travelsServiceSpy.getPrintDetails).toHaveBeenCalledWith(userId);
    tick();
    expect(travelsServiceSpy.print).toHaveBeenCalled();
  }));

  it('should create datasource after view init', () => {
    travelsDatasourceServiceSpy.create.and.returnValue(of({} as any));
    component.paginator = { page: 0 } as any;

    component.ngAfterViewInit();

    expect(travelsDatasourceServiceSpy.create).toHaveBeenCalled();
  });
});
