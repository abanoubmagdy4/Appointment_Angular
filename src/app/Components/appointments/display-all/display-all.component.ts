import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

import { AppointmentsService } from '../../../Shared/Services/Appointments.Service';
import { GeneralResponse } from '../../../models/GeneralResponse';
import { AppointmentResponse } from '../../../models/Appointments/AppointmentResponse';
import { AppointmentStatus } from '../../../models/Appointments/AppointmentStatus';

import { UpdateFormAppointmentComponent } from "../update-form-appointment/update-form-appointment.component";
import { DisplayByIdComponent } from "../display-by-id/display-by-id.component";

declare var bootstrap: any;

@Component({
  selector: 'app-display-all-appointments',
  standalone: true,
  imports: [CommonModule, FullCalendarModule, UpdateFormAppointmentComponent, DisplayByIdComponent],
  templateUrl: './display-all.component.html',
  styleUrls: ['./display-all.component.css']
})
export class DisplayAllComponent implements OnInit {

  appointments: AppointmentResponse[] = [];
  loading = false;
  errorMessage = '';
  selectedAppointmentId: number | null = null;

  calendarOptions: CalendarOptions = {
    initialView: 'timeGridWeek',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    slotDuration: { minutes: 15 },
    slotLabelInterval: { minutes: 15 },
    slotMinTime: '06:00:00',
    slotMaxTime: '22:00:00',
    allDaySlot: false,
    height: 'auto',
    aspectRatio: 1.8,
    snapDuration: { minutes: 15 },
    eventOverlap: false,
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    events: [],
    eventMinHeight: 15,
    eventContent: (arg) => {
      const container = document.createElement('div');
      container.style.cssText = `
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        text-align: center;
        padding: 2px;
      `;

      const titleEl = document.createElement('div');
      titleEl.innerText = arg.event.title;
      titleEl.style.cssText = `
        font-weight: 600;
        font-size: 9px;
        margin-bottom: 1px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 100%;
        line-height: 1.1;
      `;

      const buttonsEl = document.createElement('div');
      buttonsEl.className = 'event-buttons';

      const detailsBtn = document.createElement('button');
      detailsBtn.className = 'event-btn details';
      detailsBtn.innerText = 'V';
      detailsBtn.title = 'View Details';
      detailsBtn.onclick = (e) => {
        e.stopPropagation();
        this.openDetailsModal(+arg.event.id);
      };

      const editBtn = document.createElement('button');
      editBtn.className = 'event-btn edit';
      editBtn.innerText = 'E';
      editBtn.title = 'Edit';
      editBtn.onclick = (e) => {
        e.stopPropagation();
        this.openEditModal(+arg.event.id);
      };

      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'event-btn delete';
      deleteBtn.innerText = 'D';
      deleteBtn.title = 'Delete';
      deleteBtn.onclick = (e) => {
        e.stopPropagation();
        this.deleteAppointment(+arg.event.id);
      };

      buttonsEl.appendChild(detailsBtn);
      buttonsEl.appendChild(editBtn);
      buttonsEl.appendChild(deleteBtn);

      container.appendChild(titleEl);
      container.appendChild(buttonsEl);

      return { domNodes: [container] };
    }
  };

  constructor(private appointmentsService: AppointmentsService, private router: Router) {}

  ngOnInit(): void {
    this.loadAppointments();
  }

  loadAppointments(): void {
    this.loading = true;
    this.appointmentsService.getAll().subscribe({
      next: (res: GeneralResponse<AppointmentResponse[]>) => {
        this.appointments = res.data ?? [];
        this.calendarOptions.events = this.appointments.map(app => ({
          id: app.id.toString(),
          title: app.customerName,
          start: app.createdDate,
          end: this.calculateEndTime(app.createdDate, 15), // مدة افتراضية 15 دقيقة
          backgroundColor: this.getEventColor(app.appointmentStatus),
          borderColor: this.getEventBorderColor(app.appointmentStatus)
        }));
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = 'Error while fetching appointments';
        console.error('Error fetching appointments', err);
        this.loading = false;
      }
    });
  }

  calculateEndTime(startTime: string, durationMinutes: number = 15): string {
    const start = new Date(startTime);
    const end = new Date(start.getTime() + (durationMinutes * 60 * 1000));
    return end.toISOString();
  }


getEventColor(status: AppointmentStatus): string {
  switch(status) {
    case AppointmentStatus.Scheduled: return 'linear-gradient(135deg, #ffc107, #e0a800)'; // Yellow
    case AppointmentStatus.Completed: return 'linear-gradient(135deg, #28a745, #1e7e34)'; // Green
    case AppointmentStatus.Canceled: return 'linear-gradient(135deg, #dc3545, #a71e2a)'; // Red
    default: return 'linear-gradient(135deg, #6c757d, #495057)'; // Gray
  }
}

getEventBorderColor(status: AppointmentStatus): string {
  switch(status) {
    case AppointmentStatus.Scheduled: return '#e0a800';
    case AppointmentStatus.Completed: return '#1e7e34';
    case AppointmentStatus.Canceled: return '#a71e2a';
    default: return '#495057';
  }
}

  openDetailsModal(id: number) {
    this.selectedAppointmentId = id;
    const modalEl = document.getElementById('detailsModal');
    if (modalEl) {
      const modal = new bootstrap.Modal(modalEl);
      modal.show();
    }
  }

  openEditModal(id: number) {
    this.selectedAppointmentId = id;
    const modalEl = document.getElementById('editModal');
    if (modalEl) {
      const modal = new bootstrap.Modal(modalEl);
      modal.show();
    }
  }

deleteAppointment(id: number) {
  if (confirm('Are you sure you want to delete this appointment?')) {
    console.log("Deleting appointment:", id);

    // Call the delete function from the service
    this.appointmentsService.deleteAppointment(id).subscribe({
      next: (res) => {
        console.log('Response:', res);
        this.loadAppointments(); // Reload the appointments after deletion
        alert('Appointment deleted successfully');
      },
      error: (err) => {
        console.error('Error deleting appointment:', err);
        alert('Error occurred while deleting the appointment');
      }
    });
  }
}

getStatusText(status: AppointmentStatus): string {
  switch(status) {
    case AppointmentStatus.Scheduled: return 'Pending';
    case AppointmentStatus.Completed: return 'Confirmed';
    case AppointmentStatus.Canceled: return 'Cancelled';
    default: return 'Unknown';
  }
}

getStatusClass(status: AppointmentStatus): string {
  switch(status) {
    case AppointmentStatus.Scheduled: return 'status-pending';
    case AppointmentStatus.Completed: return 'status-confirmed';
    case AppointmentStatus.Canceled: return 'status-cancelled';
    default: return 'badge bg-secondary';
  }
}
}
