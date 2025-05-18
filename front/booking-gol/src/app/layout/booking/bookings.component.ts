import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { BookingsListComponent } from "./bookings-list/bookings-list.component";
import { BookingActionsComponent } from './booking-actions/booking-actions.component';

@Component({
  selector: 'app-bookings',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    BookingsListComponent,
    BookingActionsComponent,
  ],
  template: `
    <section class="bookings-container">
      <div class="actions-header">
        <!-- <h2>Reservas</h2> -->
        <app-booking-actions></app-booking-actions>
      </div>
      <mat-card>
        <mat-card-content style="padding: 0 16px;">
          <app-bookings-list></app-bookings-list>
        </mat-card-content>
      </mat-card>
    </section>
  `,
  styles: [`
    .bookings-container {
      width: 86%;
      max-width: 1800px;
      margin: 0 auto;
      margin-top: 30px;
    }

    .actions-header {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      margin-bottom: 16px;
      padding: 0 16px;

      h2 {
        margin: 0;
        font-size: 24px;
        font-weight: 500;
        color: rgba(0, 0, 0, 0.87);
      }
    }

    mat-card {
      margin-bottom: 20px;
    }

    mat-card-content {
      padding-top: 20px;
    }
  `]
})
export class BookingsComponent {}
