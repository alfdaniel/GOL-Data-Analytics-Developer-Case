import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, RouterModule } from '@angular/router';
import { BookingService } from '../../services/booking.service';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-reserve-registration',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatCardModule,
    MatProgressSpinnerModule,
    RouterModule,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './reserve-registration.component.html',
  styleUrls: ['./reserve-registration.component.scss']
})
export class ReserveRegistrationComponent {
  reserveForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private bookingService: BookingService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.reserveForm = this.fb.group({
      first_name: ['', [Validators.required, Validators.minLength(2)]],
      last_name: ['', [Validators.required, Validators.minLength(2)]],
      birthday: [null, Validators.required],
      document: ['', [Validators.required, Validators.pattern('^[0-9]{11}$')]],
      departure_date: ['', Validators.required],
      departure_iata: ['', [Validators.required, Validators.pattern('^[A-Z]{3}$')]],
      arrival_iata: ['', [Validators.required, Validators.pattern('^[A-Z]{3}$')]],
      arrival_date: ['', Validators.required]
    });
  }

  validateDates() {
    const departure = this.reserveForm.get('departure_date')?.value;
    const arrival = this.reserveForm.get('arrival_date')?.value;

    if (departure && arrival && new Date(arrival) <= new Date(departure)) {
      this.reserveForm.get('arrival_date')?.setErrors({ invalidDate: true });
    }
  }

  onSubmit() {
    if (this.reserveForm.valid) {
      this.loading = true;
      const data = { ...this.reserveForm.value };

      data.birthday = data.birthday.toISOString().split('T')[0];
      data.departure_date = data.departure_date.toISOString().split('T')[0];
      data.arrival_date = data.arrival_date.toISOString().split('T')[0];

      console.log('submetendo reserva', data);
      this.bookingService.createBooking(data)
        .pipe(
          catchError(error => {
            console.error('Erro ao criar reserva:', error);
            this.snackBar.open('Erro ao criar reserva. Tente novamente.', 'Fechar', {
              duration: 5000,
              panelClass: ['error-snackbar']
            });
            return of(null);
          }),
          finalize(() => this.loading = false)
        )
        .subscribe(response => {
          if (response) {
            this.snackBar.open('Reserva criada com sucesso!', 'Fechar', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
            this.router.navigate(['/lista-reservas']);
          }
        });
    }
  }
}
