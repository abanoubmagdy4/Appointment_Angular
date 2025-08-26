import { Component, Input, OnInit, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AppointmentsService } from '../../../Shared/Services/Appointments.Service';
import { AppointmentStatus } from '../../../models/Appointments/AppointmentStatus';
import { UpdateAppointment } from '../../../models/Appointments/UpdateAppointment';
import { AppointmentResponse } from '../../../models/Appointments/AppointmentResponse';
import { ToastService } from '../../../Shared/Services/ToastService';

@Component({
  selector: 'app-update-form-appointment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './update-form-appointment.component.html',
})
export class UpdateFormAppointmentComponent implements OnInit, OnChanges {
  @Input() appointmentId!: number;

  form: FormGroup;
  appointmentStatus = AppointmentStatus;
  isSubmitting = false;

  toast = inject(ToastService); // إضافة ToastService

  constructor(
    private fb: FormBuilder,
    private appointmentsService: AppointmentsService,
    private router: Router
  ) {
    this.form = this.fb.group({
      customerName: ['', [Validators.required, Validators.maxLength(100)]],
      createdDate: ['', Validators.required],
      appointmentStatus: [AppointmentStatus.Scheduled, Validators.required],
      notes: ['', Validators.maxLength(500)],
    });
  }

  ngOnInit(): void {
    if (this.appointmentId) {
      this.loadAppointment(this.appointmentId);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['appointmentId'] && changes['appointmentId'].currentValue) {
      this.loadAppointment(changes['appointmentId'].currentValue);
    }
  }

  private loadAppointment(id: number): void {
    this.appointmentsService.getById(id).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.patchForm(res.data);
          this.toast.show('Appointment loaded successfully ✅', 'success');
        } else {
          this.toast.show(res.message || 'Failed to load appointment ❌', 'error');
        }
      },
      error: (err) => {
        const apiMessage = err.error?.message || 'Error while loading appointment ❌';
        this.toast.show(apiMessage, 'error');
        console.error(err);
      }
    });
  }

  private patchForm(data: AppointmentResponse): void {
    this.form.patchValue({
      customerName: data.customerName,
      createdDate: data.createdDate,
      appointmentStatus: data.appointmentStatus,
      notes: data.notes
    });
  }

  onUpdate(): void {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const updatedAppointment: UpdateAppointment = this.form.value;

    this.appointmentsService.updateAppointment(this.appointmentId, updatedAppointment).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        if (res.success) {
          this.toast.show(res.message || 'Appointment updated successfully ✅', 'success');
          this.router.navigate(['/appointments']);
        } else {
          this.toast.show(res.message || 'Something went wrong ❌', 'error');
        }
      },
      error: (err) => {
        this.isSubmitting = false;
        const apiMessage = err.error?.message || 'Error while updating appointment ❌';
        this.toast.show(apiMessage, 'error');
        console.error(err);
      },
    });
  }
}
