import { Component, EventEmitter, Input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { BookingRegistrationComponent } from '../booking-registration/booking-registration.component';
import { BookingService } from '../../../services/booking.service';
import { NotificationService } from '../../../shared/notification';
import { UploadComponent } from '@app/shared/components/upload.component';
import { ButtonActionsComponent } from '@app/shared/components/button-actions.component';

@Component({
  selector: 'app-booking-actions',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatDialogModule,
    ButtonActionsComponent
  ],
  template: `
    <div class="actions-container">
      @for (action of actions; track action.label) {
        <app-button-actions [icon]="action.icon" [label]="action.label" (handler)="action.handler()"></app-button-actions>
      }
    </div>
  `,
  styles: [`
    .actions-container {
      display: flex;
      gap: 8px;
    }

    button {
      min-width: 40px;
      padding: 0 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 4px;

      mat-icon {
        margin: 0;
            }
    }
  `]
})
export class BookingActionsComponent {
  refresh = output<void>();

  actions = [
    {
      icon: 'add',
      label: 'Nova Reserva',
      handler: () => this.openBookingForm()
    },
    {
      icon: 'download',
      label: 'Baixar reservas',
      handler: () => this.downloadBookings()
    },
    {
      icon: 'upload',
      label: 'Enviar reservas',
      handler: () => this.openUpload()
    }
  ];

  constructor(
    private bookingService: BookingService,
    private notification: NotificationService,
    private dialog: MatDialog
  ) { }

  openBookingForm(): void {
    const dialogRef = this.dialog.open(BookingRegistrationComponent, {
      minWidth: '1000px',
      width: '1000px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.refresh.emit();
      }
    });
  }

  openUpload(): void {
    const dialogRef = this.dialog.open(UploadComponent, {
      width: '1000px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.refresh.emit();
      }
    });
  }

  downloadBookings(): void {
    this.bookingService.downloadBookings().subscribe({
      next: (response) => {
        const url = window.URL.createObjectURL(response);
        const a = document.createElement('a');
        a.href = url;
        a.download = `bookings-${new Date().toISOString().split('T')[0]}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        this.notification.showAlert('Download concluído com sucesso', 'success');
      },
      error: (error) => {
        console.error('Download error:', error);
        this.notification.showAlert('Erro ao baixar o arquivo', 'error');
      }
    });
  }

}
