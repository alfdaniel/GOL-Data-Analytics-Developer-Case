import { Routes } from "@angular/router";
import { HomeComponent } from "./layout/home/home.component";
import { ReserveRegistrationComponent } from "./booking/reserve-registration/reserve-registration.component";
import { ReserveListComponent } from "./booking/reserve-list/reserve-list.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { ReserveSpaceComponent } from "./booking/reserve-space/reserve-space.component";

export const routes: Routes = [
  // { path: '', redirectTo: 'home', pathMatch: 'full', component: HomeComponent },
  { path: '', component: HomeComponent }, // This should be the correct component for the route
  { path: 'registrar-reserva', component: ReserveRegistrationComponent },
  { path: 'lista-reservas', component: ReserveListComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'reservas', component: ReserveSpaceComponent },
  // { path: '**', redirectTo: '' }
];
