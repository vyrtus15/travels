import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { UserItem } from '../../interfaces/users.interface';
import { UsersService } from '../../services/users/users.service';
import { EditUserComponent } from './edit-user.component';

describe('EditUserComponent', () => {
  let component: EditUserComponent;
  let fixture: ComponentFixture<EditUserComponent>;

  const routerSpy = jasmine.createSpyObj<Router>('Router', ['navigate', 'getCurrentNavigation']);
  const formBuilderSpy = jasmine.createSpyObj<FormBuilder>('FormBuilder', ['group']);
  const usersServiceSpy = jasmine.createSpyObj<UsersService>('UsersService', ['update']);
  const matSnackBarSpy = jasmine.createSpyObj<MatSnackBar>('MatSnackBar', ['open']);

  const userId = '42';

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
              paramMap: new Map([['userId', userId]]),
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

    usersServiceSpy.update.calls.reset();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate if user is not present', () => {
    component.ngOnInit();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['users']);
  });

  it('should set form values from received user', () => {
    const user = { firstName: '42', lastName: 'rp' } as UserItem;
    component.item = user;

    component.ngOnInit();

    expect(formBuilderSpy.group).toHaveBeenCalled();
  });

  it('should navigate on back', () => {
    component.back();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['users']);
  });

  it('should not update user when form is not valid', () => {
    component.editUserForm = { valid: false } as any;

    component.submit();

    expect(usersServiceSpy.update).not.toHaveBeenCalled();
  });

  it('should update user on valid submit', () => {
    const user = { firstName: '42', lastName: 'rp' } as UserItem;
    component.editUserForm = { valid: true, value: user } as any;

    usersServiceSpy.update.and.returnValue(of({}));

    component.submit();

    expect(usersServiceSpy.update).toHaveBeenCalledWith(userId, user);
  });

  it('should show snack bar after success update', () => {
    const user = { firstName: '42', lastName: 'rp' } as UserItem;
    component.editUserForm = { valid: true, value: user } as any;

    usersServiceSpy.update.and.returnValue(of({}));

    component.submit();

    expect(matSnackBarSpy.open).toHaveBeenCalled();
  });
});
