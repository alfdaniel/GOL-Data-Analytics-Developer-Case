import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, provideNativeDateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { Router, RouterModule } from '@angular/router';
import { BookingService } from '../../services/booking.service';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { FormValidator } from '../../shared/validators/form.validator';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { MatDatetimepickerModule, MatNativeDatetimeModule } from '@mat-datetimepicker/core';
import { MatMomentDatetimeModule } from '@mat-datetimepicker/moment';
import { NotificationService } from '../../shared/notification';

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY HH:mm',
  },
  display: {
    dateInput: 'DD/MM/YYYY HH:mm',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'DD/MM/YYYY HH:mm',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

interface Airport {
  code: string;
  name: string;
}

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
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
    provideNgxMask(),
    // provideAnimations(),
  ],
  templateUrl: './reserve-registration.component.html',
  styleUrls: ['./reserve-registration.component.scss']
})
export class ReserveRegistrationComponent {
  reserveForm: FormGroup;
  loading = false;
  minDate = new Date();

  get departure_date() {
    return this.reserveForm.get('departure_date')?.value;
  }

  airports: Airport[] = [
    { code: 'GRU', name: 'São Paulo/Guarulhos (GRU)' },
    { code: 'BSB', name: 'Brasília (BSB)' },
    { code: 'GIG', name: 'Rio de Janeiro/Galeão (GIG)' },
    { code: 'CGH', name: 'São Paulo/Congonhas (CGH)' },
    { code: 'SSA', name: 'Salvador (SSA)' },
    { code: 'REC', name: 'Recife (REC)' },
    { code: 'POA', name: 'Porto Alegre (POA)' },
    { code: 'NAT', name: 'Natal (NAT)' },
    { code: 'FOR', name: 'Fortaleza (FOR)' },
    { code: 'BEL', name: 'Belém (BEL)' },
    { code: 'VIX', name: 'Vitória (VIX)' },
    { code: 'CWB', name: 'Curitiba (CWB)' },
    { code: 'FLN', name: 'Florianópolis (FLN)' },
    { code: 'MAO', name: 'Manaus (MAO)' },
    { code: 'GYN', name: 'Goiânia (GYN)' }
  ];

  constructor(
    private fb: FormBuilder,
    private bookingService: BookingService,
    private snackBar: MatSnackBar,
    private router: Router,
    private formValidators: FormValidator,
    private notification: NotificationService,
  ) {
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
      // this.notification.showAlert('A data de chegada deve ser posterior à data de partida.', 'error');
      this.reserveForm.get('arrival_date')?.setErrors({ invalidDate: true });
    }
  }

  confirmSubmit() {
    this.notification.confirmAlert(
      'Tem certeza que deseja solicitar a reserva?',
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

  onSubmit() {
    if (this.reserveForm.valid) {
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
          }
        });
    } else {
      this.notification.showAlert('Por favor, preencha todos os campos corretamente.', 'error');
    }
  }
}


