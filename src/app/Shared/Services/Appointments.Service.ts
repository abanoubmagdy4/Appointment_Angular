import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GeneralResponse } from '../../models/GeneralResponse';
import { AppointmentResponse } from '../../../app/models/Appointments/AppointmentResponse';
import { AppointmentAddRequest } from '../../../app/models/Appointments/AppointmentAddRequest';
import { UpdateAppointment } from '../../models/Appointments/UpdateAppointment';
import {environment} from'../../../environments/environment'
import { $locationShim } from '@angular/common/upgrade';
@Injectable({ providedIn: 'root' })
export class AppointmentsService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.pathUrl}/Appointment`;

  // Get all appointments
  getAll(): Observable<GeneralResponse<AppointmentResponse[]>> {
    return this.http.get<GeneralResponse<AppointmentResponse[]>>(this.baseUrl);
  }

  // Get appointment by ID
  getById(id: number): Observable<GeneralResponse<AppointmentResponse>> {
    return this.http.get<GeneralResponse<AppointmentResponse>>(`${this.baseUrl}/${id}`);
  }

  // Add appointment
  addAppointment(dto: AppointmentAddRequest): Observable<GeneralResponse<AppointmentResponse>> {

    return this.http.post<GeneralResponse<AppointmentResponse>>(this.baseUrl, dto);
  }

  // Update appointment
  updateAppointment(id: number, dto: UpdateAppointment): Observable<GeneralResponse<AppointmentResponse>> {
    return this.http.put<GeneralResponse<AppointmentResponse>>(`${this.baseUrl}/${id}`, dto);
  }

  // Delete appointment
  deleteAppointment(id: number): Observable<GeneralResponse<void>> {
    return this.http.delete<GeneralResponse<void>>(`${this.baseUrl}/${id}`);
  }
}
