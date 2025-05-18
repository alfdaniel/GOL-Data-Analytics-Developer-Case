import { Component, inject, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NotificationService } from '@app/shared/notification';
import { MatDialog } from '@angular/material/dialog';
import { BookingService } from '@app/services/booking.service';


@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <section class="content">
      <div class="no-file">
          <span>{{selectedFile ? 'Documento Selecionado' : 'Selecionar documento do tipo .XLS'}}</span>
          <mat-icon (click)="close()">close</mat-icon>
        </div>
      <mat-card-content>
        <div class="file-info" *ngIf="selectedFile">
          <p><strong>Nome:</strong> {{selectedFile.name}}</p>
          <p><strong>Tamanho:</strong> {{(selectedFile.size / 1024 / 1024).toFixed(2)}} MB</p>
        </div>
      </mat-card-content>

      <mat-card-actions class="actions">
        <input type="file"
               #fileInput
               (change)="onFileSelected($event)"
               accept=".xlsx"
               style="display: none">

        <button mat-raised-button
                color="primary"
                (click)="fileInput.click()">
                {{selectedFile ? 'Substituir Documento' : 'Selecionar Documento'}}
                <mat-icon>upload_file</mat-icon>
        </button>

        <button mat-raised-button
                *ngIf="selectedFile"
                color="accent"
                [disabled]="!selectedFile"
                (click)="comfirmed()">
                Enviar Documento
                <mat-icon>send</mat-icon>
        </button>
      </mat-card-actions>
    </section>
  `,
  styles: [`
    .content {
      margin: 20px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .no-file {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .actions {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
      width: 100%;
      gap: 20px;
    }
  `]
})
export class UploadComponent {
  private dialog: MatDialog = inject(MatDialog);
  private notification: NotificationService = inject(NotificationService);
  private bookingService: BookingService = inject(BookingService);

  @Output() refresh = new EventEmitter<void>();
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  isImageFile = false;

  downloadBookings() {
    this.bookingService.downloadBookings().subscribe({
      next: (response: Blob) => {
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
      error: (error) => {
        this.notification.showAlert('Erro ao baixar o arquivo', 'error');
      }
    });
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
    }
  }

  async comfirmed() {
    const result = await this.notification.confirmAlert('Tem certeza que deseja enviar o documento?', '', 'Enviar', 'Cancelar', 'question');

    if (result.isConfirmed) {
      this.enviarDocumento();
    } else {
      this.notification.showAlert('Upload cancelado', 'info');
      this.close();
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
          this.refresh.emit();
          this.close();
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

  close() {
    this.selectedFile = null;
    this.previewUrl = null;
    this.isImageFile = false;
    this.dialog.closeAll();
  }

}

