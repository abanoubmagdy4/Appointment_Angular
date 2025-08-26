import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFormAppointmentComponent } from './add-form-appointment.component';

describe('AddFormAppointmentComponent', () => {
  let component: AddFormAppointmentComponent;
  let fixture: ComponentFixture<AddFormAppointmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddFormAppointmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddFormAppointmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
