import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { TravelsService } from '../../services/travels/travels.service';
import { EditTravelComponent } from './edit-travel.component';
import { MatNativeDateModule } from '@angular/material/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('EditTravelComponent', () => {
  let component: EditTravelComponent;
  let fixture: ComponentFixture<EditTravelComponent>;

  const routerSpy = jasmine.createSpyObj<Router>('Router', ['navigate', 'getCurrentNavigation']);
  const formBuilderSpy = jasmine.createSpyObj<FormBuilder>('FormBuilder', ['group']);
  const travelsServiceSpy = jasmine.createSpyObj<TravelsService>('TravelsService', ['update']);
  const matSnackBarSpy = jasmine.createSpyObj<MatSnackBar>('MatSnackBar', ['open']);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        MatButtonModule,
        MatInputModule,
        MatCardModule,
        MatIconModule,
        MatDatepickerModule,
        MatNativeDateModule,
      ],
      declarations: [EditTravelComponent],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: FormBuilder, useValue: formBuilderSpy },
        { provide: TravelsService, useValue: travelsServiceSpy },
        { provide: MatSnackBar, useValue: matSnackBarSpy },
        {
          provide: ActivatedRoute, useValue: {
            snapshot: {
              paramMap: new Map([['userId', '4'], ['travelId', '2']]),
            },
          },
        },
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    formBuilderSpy.group.and.returnValue({
      controls: {
        destination: { hasError: () => { } },
        startDate: { hasError: () => { } },
        endDate: { hasError: () => { } },
        comment: { hasError: () => { } },
      }
    } as any);
    fixture = TestBed.createComponent(EditTravelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
