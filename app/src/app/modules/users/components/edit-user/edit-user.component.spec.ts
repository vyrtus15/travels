import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from '../../services/users/users.service';
import { EditUserComponent } from './edit-user.component';

describe('EditUserComponent', () => {
  let component: EditUserComponent;
  let fixture: ComponentFixture<EditUserComponent>;

  const routerSpy = jasmine.createSpyObj<Router>('Router', ['navigate', 'getCurrentNavigation']);
  const formBuilderSpy = jasmine.createSpyObj<FormBuilder>('FormBuilder', ['group']);
  const usersServiceSpy = jasmine.createSpyObj<UsersService>('UsersService', ['update']);
  const matSnackBarSpy = jasmine.createSpyObj<MatSnackBar>('MatSnackBar', ['open']);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        MatButtonModule,
        MatInputModule,
        MatCardModule,
      ],
      declarations: [EditUserComponent],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: FormBuilder, useValue: formBuilderSpy },
        { provide: UsersService, useValue: usersServiceSpy },
        { provide: MatSnackBar, useValue: matSnackBarSpy },
        {
          provide: ActivatedRoute, useValue: {
            snapshot: {
              paramMap: new Map([['userId', '4']]),
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
        firstName: { hasError: () => { } },
        lastName: { hasError: () => { } },
      }
    } as any);
    fixture = TestBed.createComponent(EditUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
