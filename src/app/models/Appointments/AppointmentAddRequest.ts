import { AppointmentStatus } from './AppointmentStatus';

export interface AppointmentAddRequest {
  customerName: string;
  createdDate: string; // string ISO format
  appointmentStatus: AppointmentStatus;
  notes?: string;
}
