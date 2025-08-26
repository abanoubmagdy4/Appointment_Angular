import { AppointmentStatus } from './AppointmentStatus';

export interface UpdateAppointment {
  customerName: string;
  createdDate: string;
  appointmentStatus: AppointmentStatus;
  notes?: string;
}
