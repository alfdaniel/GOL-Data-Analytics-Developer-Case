import { Routes } from '@angular/router';
import { BookingsComponent } from '@app/layout/booking/bookings.component';
import { DashboardComponent } from '@app/layout/dashboard/dashboard.component';

export interface Claim {
  action: string;
}

export interface MenuItem {
  label: string;
  icon: string;
  route: string;
  component: any;
  claims?: Claim[];
  subItems?: MenuItem[];
}

export const MENU_ITEMS: MenuItem[] = [
  {
    label: 'Gestão de Reservas',
    icon: 'calendar_month',
    route: '/bookings',
    component: BookingsComponent,
    claims: []
  },
  {
    label: 'Dashboard',
    icon: 'dashboard',
    route: '/dashboard',
    component: DashboardComponent,
    claims: []
  }
];

export const APP_ROUTES: Routes = MENU_ITEMS.map(item => ({
  path: item.route.slice(1),
  component: item.component,
}));
