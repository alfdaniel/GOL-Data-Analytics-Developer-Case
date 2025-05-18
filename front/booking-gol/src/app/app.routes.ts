import { Routes } from '@angular/router';
import { APP_ROUTES } from '@app/config/menu.config';

export const routes: Routes = [
  { path: '', redirectTo: '/bookings', pathMatch: 'full' },
  ...APP_ROUTES
];
