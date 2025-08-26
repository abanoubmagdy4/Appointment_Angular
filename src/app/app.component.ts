import { Component } from '@angular/core';
import { AddFormAppointmentComponent } from './Components/appointments/add-form-appointment/add-form-appointment.component';
import { DisplayAllComponent } from "./Components/appointments/display-all/display-all.component";

@Component({
  selector: 'app-root',
  imports: [AddFormAppointmentComponent, DisplayAllComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Appointment_Scheduling_System_Angular';
}
