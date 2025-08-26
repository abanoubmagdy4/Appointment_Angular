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
import { UpdateFormAppointmentComponent } from "../update-form-appointment/update-form-appointment.component";
import { DisplayByIdComponent } from "../display-by-id/display-by-id.component";

declare var bootstrap: any;

@Component({
  selector: 'app-display-all-appointments',
  standalone: true,
  imports: [CommonModule, FullCalendarModule, UpdateFormAppointmentComponent, DisplayByIdComponent],
  template: `
    <div *ngIf="loading" class="text-center my-3">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    <div *ngIf="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>

    <!-- FullCalendar -->
    <div class="calendar-container mb-4">
      <full-calendar [options]="calendarOptions"></full-calendar>
    </div>

    <!-- Cards List with buttons -->
    <div class="row g-3">
      <div class="col-12 col-sm-6 col-lg-4 col-xl-3" *ngFor="let appointment of appointments">
        <div class="card h-100 shadow-sm appointment-card">
          <div class="card-body">
            <h6 class="card-title text-primary mb-2">{{ appointment.customerName }}</h6>
            <p class="card-text mb-1">
              <small class="text-muted">Status:</small>
              <span [class]="getStatusClass(appointment.appointmentStatus)">
                {{ getStatusText(appointment.appointmentStatus) }}
              </span>
            </p>
            <p class="card-text mb-1">
              <small class="text-muted">Created:</small>
              <span class="text-dark">{{ appointment.createdDate | date:'short' }}</span>
            </p>
            <p class="card-text">
              <small class="text-muted">Notes:</small>
              <span class="text-dark">{{ appointment.notes || 'No notes' }}</span>
            </p>
          </div>
          <div class="card-footer bg-transparent border-top-0 p-2">
            <div class="btn-group w-100" role="group">
              <button
                class="btn btn-outline-info btn-sm flex-fill"
                (click)="openDetailsModal(appointment.id)"
                title="View Details">
                <i class="fas fa-eye me-1"></i>Details
              </button>
              <button
                class="btn btn-warning btn-sm flex-fill text-white"
                (click)="openEditModal(appointment.id)"
                title="Edit Appointment">
                <i class="fas fa-edit me-1"></i>Edit
              </button>
              <button
                class="btn btn-danger btn-sm flex-fill"
                (click)="deleteAppointment(appointment.id)"
                title="Delete Appointment">
                <i class="fas fa-trash me-1"></i>Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Update -->
    <div class="modal fade" id="editModal" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header bg-warning text-white">
            <h5 class="modal-title">
              <i class="fas fa-edit me-2"></i>Edit Appointment
            </h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <app-update-form-appointment *ngIf="selectedAppointmentId" [appointmentId]="selectedAppointmentId"></app-update-form-appointment>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Details -->
    <div class="modal fade" id="detailsModal" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header bg-info text-white">
            <h5 class="modal-title">
              <i class="fas fa-info-circle me-2"></i>Appointment Details
            </h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <app-display-by-id *ngIf="selectedAppointmentId" [appointmentId]="selectedAppointmentId"></app-display-by-id>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* Calendar Styles */
    .calendar-container {
      background: white;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }

    /* FullCalendar Grid Adjustments */
    ::ng-deep .fc {
      font-size: 13px;
    }

    ::ng-deep .fc-timegrid-slot {
      height: 40px !important; /* كل 15 دقيقة = 40px */
      border-bottom: 1px solid #e9ecef;
    }

    ::ng-deep .fc-timegrid-slot-minor {
      border-bottom: 1px dotted #f5f5f5;
    }

    ::ng-deep .fc-timegrid-slot-label {
      font-size: 11px !important;
      color: #6c757d !important;
    }

    ::ng-deep .fc-col-header-cell {
      background: #f8f9fa;
      font-weight: 600;
      padding: 8px 4px;
      font-size: 12px;
    }

    ::ng-deep .fc-timegrid-axis {
      width: 70px !important;
      font-size: 10px;
    }

    ::ng-deep .fc-timegrid-col-events {
      margin: 0 2px;
    }

    /* Calendar Event Styling */
    ::ng-deep .fc-event {
      border: none !important;
      border-radius: 8px !important;
      background: linear-gradient(135deg, #4f46e5, #7c3aed) !important;
      color: white !important;
      padding: 4px 6px !important;
      margin: 1px !important;
      font-size: 11px !important;
      box-shadow: 0 2px 8px rgba(79, 70, 229, 0.3) !important;
      cursor: pointer !important;
      transition: all 0.2s ease !important;
    }

    ::ng-deep .fc-event:hover {
      transform: scale(1.02) !important;
      box-shadow: 0 4px 12px rgba(79, 70, 229, 0.4) !important;
    }

    /* Event Content Styling */
    ::ng-deep .fc-event-title {
      font-weight: 600 !important;
      text-align: center !important;
      margin-bottom: 3px !important;
    }

    /* Custom Event Buttons */
    ::ng-deep .event-buttons {
      display: flex !important;
      gap: 1px !important;
      justify-content: center !important;
      margin-top: 1px !important;
    }

    ::ng-deep .event-btn {
      padding: 1px 3px !important;
      font-size: 8px !important;
      border-radius: 2px !important;
      border: 1px solid rgba(255,255,255,0.4) !important;
      background: rgba(255,255,255,0.2) !important;
      color: white !important;
      cursor: pointer !important;
      transition: all 0.2s ease !important;
      line-height: 1 !important;
      min-width: 18px !important;
    }

    ::ng-deep .event-btn:hover {
      background: rgba(255,255,255,0.4) !important;
      transform: scale(1.1) !important;
    }

    ::ng-deep .event-btn.details { border-color: #17a2b8 !important; }
    ::ng-deep .event-btn.edit { border-color: #ffc107 !important; }
    ::ng-deep .event-btn.delete { border-color: #dc3545 !important; }

    /* Card Styles */
    .appointment-card {
      transition: all 0.3s ease;
      border: 1px solid #e9ecef;
      border-radius: 12px;
      overflow: hidden;
    }

    .appointment-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 25px rgba(0,0,0,0.15) !important;
      border-color: #007bff;
    }

    .card-title {
      font-size: 1rem;
      font-weight: 600;
    }

    .card-text {
      font-size: 0.85rem;
      line-height: 1.4;
    }

    /* Status Badge Styles */
    .status-pending {
      background: #fff3cd;
      color: #856404;
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 500;
    }

    .status-confirmed {
      background: #d1edff;
      color: #084298;
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 500;
    }

    .status-cancelled {
      background: #f8d7da;
      color: #721c24;
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 500;
    }

    /* Button Group Improvements */
    .btn-group .btn {
      font-size: 0.8rem;
      font-weight: 500;
      transition: all 0.2s ease;
    }

    .btn-outline-info:hover {
      transform: scale(1.02);
      box-shadow: 0 2px 8px rgba(23, 162, 184, 0.3);
    }

    .btn-warning:hover {
      transform: scale(1.02);
      box-shadow: 0 2px 8px rgba(255, 193, 7, 0.4);
    }

    .btn-danger:hover {
      transform: scale(1.02);
      box-shadow: 0 2px 8px rgba(220, 53, 69, 0.3);
    }

    /* Responsive Adjustments */
    @media (max-width: 768px) {
      ::ng-deep .fc-timegrid-slot {
        height: 30px !important;
      }

      ::ng-deep .fc-event {
        min-height: 28px !important;
        font-size: 8px !important;
      }

      .calendar-container {
        padding: 10px;
      }

      .btn-group .btn {
        font-size: 0.7rem;
        padding: 0.375rem 0.5rem;
      }

      ::ng-deep .fc-timegrid-axis {
        width: 60px !important;
      }
    }

    /* Modal Header Improvements */
    .modal-header {
      border-radius: 0;
      padding: 1rem 1.5rem;
    }

    .modal-content {
      border-radius: 12px;
      border: none;
      box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    }

    /* Loading Spinner */
    .spinner-border {
      width: 3rem;
      height: 3rem;
    }
  `]
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
    slotDuration: { minutes: 15 }, // كل خانة = 15 دقيقة
    slotLabelInterval: { minutes: 15 }, // عرض التوقيت كل 15 دقيقة
    slotMinTime: '06:00:00',
    slotMaxTime: '22:00:00',
    allDaySlot: false,
    height: 'auto',
    aspectRatio: 1.8,
    snapDuration: { minutes: 15 }, // محاذاة الأحداث مع الخانات
    eventOverlap: false, // منع تداخل الأحداث
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    events: [],
    eventMinHeight: 15, // الحد الأدنى لارتفاع الحدث
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

  getEventColor(status: number): string {
    switch(status) {
      case 0: return 'linear-gradient(135deg, #ffc107, #e0a800)'; // Pending - Yellow
      case 1: return 'linear-gradient(135deg, #28a745, #1e7e34)'; // Confirmed - Green
      case 2: return 'linear-gradient(135deg, #dc3545, #a71e2a)'; // Cancelled - Red
      default: return 'linear-gradient(135deg, #6c757d, #495057)'; // Unknown - Gray
    }
  }

  getEventBorderColor(status: number): string {
    switch(status) {
      case 0: return '#e0a800';
      case 1: return '#1e7e34';
      case 2: return '#a71e2a';
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

  getStatusText(status: number): string {
    switch(status) {
      case 0: return 'Pending';
      case 1: return 'Confirmed';
      case 2: return 'Cancelled';
      default: return 'Unknown';
    }
  }

  getStatusClass(status: number): string {
    switch(status) {
      case 0: return 'status-pending';
      case 1: return 'status-confirmed';
      case 2: return 'status-cancelled';
      default: return 'badge bg-secondary';
    }
  }
}
