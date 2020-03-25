import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteTravelComponent } from './delete-travel.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

describe('DeleteTravelComponent', () => {
  let component: DeleteTravelComponent;
  let fixture: ComponentFixture<DeleteTravelComponent>;

  const matDialogRefSpy = jasmine.createSpyObj<MatDialogRef<DeleteTravelComponent>>('MatDialogRef', ['close']);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DeleteTravelComponent],
      providers: [
        { provide: MatDialogRef, useValue: matDialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: { travel: {} } },
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteTravelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
