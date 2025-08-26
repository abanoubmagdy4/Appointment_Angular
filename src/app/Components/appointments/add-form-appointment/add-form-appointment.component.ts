import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AppointmentAddRequest } from '../../../models/Appointments/AppointmentAddRequest';
import { AppointmentStatus } from '../../../models/Appointments/AppointmentStatus';
import { AppointmentsService } from '../../../Shared/Services/Appointments.Service';
import { ToastService } from '../../../Shared/Services/ToastService';

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

  toast = inject(ToastService);

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

  testToast() {
    this.toast.show('Appointment added successfully!', 'success');
  }

  onSubmit() {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const appointment: AppointmentAddRequest = this.form.value;

    this.appointmentsService.addAppointment(appointment).subscribe({
      next: (res) => {
        this.isSubmitting = false;

        if (res.success) {
          this.toast.show(res.message || 'Appointment added successfully!', 'success');
          this.form.reset({ appointmentStatus: AppointmentStatus.Scheduled });
        } else {
          this.toast.show(res.message || 'Something went wrong ❌', 'error');
        }
      },
      error: (err) => {
        this.isSubmitting = false;

        const apiMessage = err.error?.message || "Error while saving appointment ❌";
        this.toast.show(apiMessage, 'error');
        console.error(err);
      },
    });
  }
}
