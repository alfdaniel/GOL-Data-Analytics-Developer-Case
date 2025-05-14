import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Booking, BookingService } from '../../services/booking.service';
import { NotificationService } from '../../shared/notification';

@Component({
  selector: 'app-reserve-details',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],

  templateUrl: './reserve-details.component.html',
  styleUrls: ['./reserve-details.component.scss']
})
export class ReserveDetailsComponent {
  // @Input() booking!: Booking;
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  isImageFile = false;

  private bookingService: BookingService = inject(BookingService);

  booking: Booking = {
    id: 1,
    first_name: 'John',
    last_name: 'Doe',
    document: '1234567890',
    birthday: new Date('1990-01-01'),
    departure_iata: 'GRU',
    arrival_iata: 'GIG',
    departure_date: new Date('2023-01-01'),
    arrival_date: new Date('2023-01-02'),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  constructor(private notification: NotificationService) { }

  downloadBookings() {
    this.bookingService.downloadBookings().subscribe(
      (response: Blob) => {
        const contentDisposition = response.type;
        const blob = new Blob([response], { type: response.type });
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;

        a.download = 'bookings';
        document.body.appendChild(a);
        a.click();

        window.URL.revokeObjectURL(url);
        a.remove();
      },
      error => {
        this.notification.showAlert('Erro ao baixar o arquivo', 'error');
      }
    );
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        this.notification.showAlert('O arquivo deve ter no máximo 5MB', 'error');
        return;
      }

      const validTypes = ['.xlsx'];
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();

      if (!validTypes.includes(fileExtension)) {
        this.notification.showAlert('Formato de arquivo inválido. Use XLS ou XLSX', 'error');
        return;
      }

      this.selectedFile = file;
      this.isImageFile = file.type.startsWith('image/');

      if (this.isImageFile) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.previewUrl = e.target?.result as string;
        };
        reader.readAsDataURL(file);
      } else {
        this.previewUrl = null;
      }

      this.notification.showAlert('Arquivo selecionado', 'info');
    }
  }

  async reviasarEnviaDocumento() {
    const result = await this.notification.confirmAlert('Tem certeza que deseja enviar o documento?', 'success');
    if (result.isConfirmed) {
      this.enviarDocumento();
    }
  }

  enviarDocumento() {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('content', this.selectedFile);


      this.bookingService.uploadBookings(formData).subscribe({
        next: (response) => {
          console.log('Upload sucesso:', response);
          this.notification.showAlert('Documento enviado com sucesso', 'success');
        },
        error: (error) => {
          console.error('Erro no upload:', error);
          this.notification.showAlert(
            error.error?.detail || 'Erro ao enviar documento. Tente novamente.',
            'error'
          );
        }
      });
    };
  }
}

