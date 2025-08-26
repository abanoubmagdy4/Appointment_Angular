import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AppointmentsService } from '../../../Shared/Services/Appointments.Service';
import { AppointmentResponse } from '../../../models/Appointments/AppointmentResponse';
import { AppointmentStatus } from '../../../models/Appointments/AppointmentStatus';
import { CommonModule } from '@angular/common';
declare var bootstrap: any;

@Component({
  selector: 'app-display-by-id',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './display-by-id.component.html',
  styleUrls: ['./display-by-id.component.css']
})
export class DisplayByIdComponent implements OnChanges {
@Input() appointmentId!: number;
  appointment: AppointmentResponse | null = null;
  loading: boolean = false;
  errorMessage: string = '';

  constructor(private appointmentsService: AppointmentsService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['appointmentId'] && this.appointmentId) {
      this.getAppointmentById(this.appointmentId);
    }
  }

  private getAppointmentById(id: number) {
    this.loading = true;
    this.errorMessage = '';
    this.appointmentsService.getById(id).subscribe({
      next: (res) => {
        if (res && res.data) {
          this.appointment = res.data;
        } else {
          this.errorMessage = 'Appointment not found';
          this.appointment = null;
        }
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Error loading appointment';
        this.loading = false;
      }
    });
  }

  getStatusClass(status: AppointmentStatus): string {
    switch (status) {
      case AppointmentStatus.Scheduled:
        return 'status-pending';
      case AppointmentStatus.Completed:
        return 'status-confirmed';
      case AppointmentStatus.Canceled:
        return 'status-cancelled';
      default:
        return '';
    }
  }

  getStatusText(status: AppointmentStatus): string {
    return AppointmentStatus[status];
  }
goBack() {
  const modalEl = document.getElementById('detailsModal');
  if (modalEl) {
    const modal = bootstrap.Modal.getInstance(modalEl);
    modal?.hide();
  }
}

}
