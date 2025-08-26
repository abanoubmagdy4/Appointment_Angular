import { AppointmentStatus } from './AppointmentStatus';

export interface AppointmentResponse {
  id: number;
  customerName: string;
  createdDate: string;
  appointmentStatus: AppointmentStatus;
  notes?: string;
}
