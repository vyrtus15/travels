import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTravelComponent } from './edit-travel.component';

describe('EditTravelComponent', () => {
  let component: EditTravelComponent;
  let fixture: ComponentFixture<EditTravelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditTravelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditTravelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
