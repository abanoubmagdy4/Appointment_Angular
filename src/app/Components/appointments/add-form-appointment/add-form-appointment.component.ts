import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AppointmentAddRequest } from '../../../models/Appointments/AppointmentAddRequest';
import { AppointmentStatus } from '../../../models/Appointments/AppointmentStatus';
import { AppointmentsService } from '../../../Shared/Services/Appointments.Service';

@Component({
  selector: 'app-add-form-appointment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-form-appointment.component.html',
})
export class AddFormAppointmentComponent {
  form: FormGroup;
  appointmentStatus = AppointmentStatus;
  isSubmitting = false;
  message: string | null = null;

  constructor(
    private fb: FormBuilder,
    private appointmentsService: AppointmentsService
  ) {
    this.form = this.fb.group({
      customerName: ['', [Validators.required, Validators.maxLength(100)]],
      createdDate: ['', Validators.required],
      appointmentStatus: [AppointmentStatus.Scheduled, Validators.required],
      notes: ['', Validators.maxLength(500)],
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.isSubmitting = true;
      this.message = null;

      const appointment: AppointmentAddRequest = this.form.value;

      this.appointmentsService.addAppointment(appointment).subscribe({

        next: (res) => {
              console.log(this.form.value);

          this.isSubmitting = false;
          if (res.success) {
            this.message = "Appointment added successfully ✅";
            this.form.reset({
              appointmentStatus: AppointmentStatus.Scheduled
            });
          } else {
            this.message = res.message || "Something went wrong ❌";
          }
        },
        error: (err) => {
          this.isSubmitting = false;
          this.message = "Error while saving appointment ❌";
          console.error(err);
        },
      });
    } else {
      this.form.markAllAsTouched();
    }
  }
}
