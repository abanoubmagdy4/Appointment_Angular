import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AppointmentsService } from '../../../Shared/Services/Appointments.Service';
import { AppointmentStatus } from '../../../models/Appointments/AppointmentStatus';
import { UpdateAppointment } from '../../../models/Appointments/UpdateAppointment';
import { AppointmentResponse } from '../../../models/Appointments/AppointmentResponse';

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
  message: string | null = null;

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
    // لو جه id عند بداية الكومبوننت
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
        } else {
          this.message = 'Failed to load appointment ❌';
        }
      },
      error: (err) => {
        console.error(err);
        this.message = 'Error while loading appointment ❌';
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
    if (this.form.valid) {
      this.isSubmitting = true;
      this.message = null;

      const updatedAppointment: UpdateAppointment = this.form.value;

      this.appointmentsService.updateAppointment(this.appointmentId, updatedAppointment).subscribe({
        next: (res) => {
          this.isSubmitting = false;
          if (res.success) {
            this.message = 'Appointment updated successfully ✅';
            this.router.navigate(['/appointments']);
          } else {
            this.message = res.message || 'Something went wrong ❌';
          }
        },
        error: (err) => {
          this.isSubmitting = false;
          this.message = 'Error while updating appointment ❌';
          console.error(err);
        },
      });
    } else {
      this.form.markAllAsTouched();
    }
  }
}
