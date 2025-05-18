import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { Router, RouterModule } from '@angular/router';
import { BookingService } from '../../../services/booking.service';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { FormValidator } from '../../../shared/validators/form.validator';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { MatDatetimepickerModule, MatNativeDatetimeModule } from '@mat-datetimepicker/core';
import { MatMomentDatetimeModule } from '@mat-datetimepicker/moment';
import { NotificationService } from '../../../shared/notification';
import { MatDialog } from '@angular/material/dialog';
import { AirportService } from '../../../services/airport.service';

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
    MatSelectModule,
    RouterModule,
    NgxMaskDirective,
    MatDatetimepickerModule,
    MatNativeDatetimeModule,
    MatMomentDatetimeModule
  ],
  providers: [
    provideNativeDateAdapter(),
    provideNgxMask(),
  ],
  templateUrl: './booking-registration.component.html',
  styleUrls: ['./booking-registration.component.scss']
})
export class BookingRegistrationComponent {
  reserveForm: FormGroup;
  loading = false;
  minDate = new Date();
  airports;

  get departure_date() {
    return this.reserveForm.get('departure_date')?.value;
  }

  constructor(
    private fb: FormBuilder,
    private bookingService: BookingService,
    private router: Router,
    private formValidators: FormValidator,
    private notification: NotificationService,
    private dialog: MatDialog,
    private airportService: AirportService
  ) {

    this.airports = this.airportService.airportsList;

    this.reserveForm = this.fb.group({
      first_name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50), this.formValidators.nameValidator]],
      last_name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50), this.formValidators.nameValidator]],
      document: ['', [Validators.required, this.formValidators.cpfValidator, Validators.minLength(11), Validators.maxLength(11)]],
      birthday: ['', [Validators.required]],
      departure_date: ['', [Validators.required, this.formValidators.dateValidator]],
      departure_iata: ['', [Validators.required]],
      arrival_iata: ['', [Validators.required]],
      arrival_date: ['', [Validators.required, this.formValidators.dateValidator]]
    });
  }


  validateDates() {
    const departure = this.reserveForm.get('departure_date')?.value;
    const arrival = this.reserveForm.get('arrival_date')?.value;

    if (departure && arrival && new Date(arrival) < new Date(departure)) {
      this.reserveForm.get('arrival_date')?.setErrors({ invalidDate: true });
    }
  }

  confirmSubmit() {
    this.notification.confirmAlert(
      'Deseja confirmar a reserva?',
      'Escolha uma opção para continuar',
      'Reservar',
      'Cancelar',
      'question'
    )
      .then((result) => {
        if (result.isConfirmed) {
          this.onSubmit();
        }
      });
  }

  onSubmit(): void {
    if (this.reserveForm.invalid) {
      this.notification.showAlert('Por favor, preencha todos os campos corretamente.', 'error');
      return;
    }

    this.loading = true;
    const data = { ...this.reserveForm.value };

    this.bookingService.createBooking(data)
      .pipe(
        catchError(error => {
          this.notification.showAlert('Erro ao criar reserva. Tente novamente.', 'error');
          return of(null);
        }),
        finalize(() => this.loading = false)
      )
      .subscribe(response => {
        if (response) {
          this.notification.showAlertSuccess('Reserva criada com sucesso!');
          this.router.navigate(['/lista-reservas']);
          this.close();
        }
      });
  }

  close() {
    this.dialog.closeAll();
  }

  cancel() {
    this.close();
  }
}


