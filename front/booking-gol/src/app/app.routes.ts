import { Routes } from "@angular/router";
import { ReserveListComponent } from "./booking/reserve-list/reserve-list.component";
import { ReserveRegistrationComponent } from "./booking/reserve-registration/reserve-registration.component";
import { HomeComponent } from "./layout/home/home.component";

export const routes: Routes = [
  // { path: '', redirectTo: 'home', pathMatch: 'full', component: HomeComponent },
  { path: '', component: HomeComponent }, // This should be the correct component for the route
  { path: 'reserve-list', component: ReserveListComponent },
  { path: 'registrar-reserva', component: ReserveRegistrationComponent }, // This should be the correct component for the route
];
