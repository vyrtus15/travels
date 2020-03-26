import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { TravelsItem } from '../../interfaces/travel.interface';
import { TravelsService } from '../../services/travels/travels.service';
import { EditTravelComponent } from './edit-travel.component';

describe('EditTravelComponent', () => {
  let component: EditTravelComponent;
  let fixture: ComponentFixture<EditTravelComponent>;

  const routerSpy = jasmine.createSpyObj<Router>('Router', ['navigate', 'getCurrentNavigation']);
  const formBuilderSpy = jasmine.createSpyObj<FormBuilder>('FormBuilder', ['group']);
  const travelsServiceSpy = jasmine.createSpyObj<TravelsService>('TravelsService', ['update']);
  const matSnackBarSpy = jasmine.createSpyObj<MatSnackBar>('MatSnackBar', ['open']);

  const userId = '42';
  const travelId = '4242';

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
              paramMap: new Map([['userId', userId], ['travelId', travelId]]),
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

    travelsServiceSpy.update.calls.reset();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate if user is not present', () => {
    component.ngOnInit();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['travels', userId]);
  });

  it('should set form values from received user', () => {
    const user = { destination: 'rp' } as TravelsItem;
    component.item = user;

    component.ngOnInit();

    expect(formBuilderSpy.group).toHaveBeenCalled();
  });

  it('should navigate on back', () => {
    component.back();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['travels', userId]);
  });

  it('should not update travel when form is not valid', () => {
    component.editTravelForm = { valid: false } as any;

    component.submit();

    expect(travelsServiceSpy.update).not.toHaveBeenCalled();
  });

  it('should update travel on valid submit', () => {
    const travel = { destination: 'rp' } as TravelsItem;
    component.editTravelForm = { valid: true, value: travel } as any;

    travelsServiceSpy.update.and.returnValue(of({}));

    component.submit();

    expect(travelsServiceSpy.update).toHaveBeenCalledWith(userId, travelId, travel);
  });

  it('should show snack bar after success update', () => {
    const travel = { destination: 'rp' } as TravelsItem;
    component.editTravelForm = { valid: true, value: travel } as any;

    travelsServiceSpy.update.and.returnValue(of({}));

    component.submit();

    expect(matSnackBarSpy.open).toHaveBeenCalled();
  });
});
