import { Routes } from '@angular/router';
import { AddFormAppointmentComponent } from './Components/appointments/add-form-appointment/add-form-appointment.component';
import { UpdateFormAppointmentComponent } from './Components/appointments/update-form-appointment/update-form-appointment.component';
import { DisplayAllComponent } from './Components/appointments/display-all/display-all.component';
import { DisplayByIdComponent } from './Components/appointments/display-by-id/display-by-id.component';

export const routes: Routes = [
  { path: 'appointments/add', component: AddFormAppointmentComponent },
  { path: 'appointments/update/:id', component: UpdateFormAppointmentComponent },
  { path: 'appointments', component: DisplayAllComponent },
  { path: 'appointments/:id', component: DisplayByIdComponent },
];
