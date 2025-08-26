import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateFormAppointmentComponent } from './update-form-appointment.component';

describe('UpdateFormAppointmentComponent', () => {
  let component: UpdateFormAppointmentComponent;
  let fixture: ComponentFixture<UpdateFormAppointmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateFormAppointmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateFormAppointmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
