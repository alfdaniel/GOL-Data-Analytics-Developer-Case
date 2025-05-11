import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';

interface Booking {
  first_name: string;
  last_name: string;
  birthday: Date;
  document: string;
  departure_date: string;
  departure_iata: string;
  arrival_iata: string;
  arrival_date: string;
}

@Component({
  standalone: true,
  imports: [
    MatFormFieldModule,
    ReactiveFormsModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideNativeDateAdapter()],
  templateUrl: './reserve-registration.component.html',
  styleUrls: ['./reserve-registration.component.scss'] // corrected 'styleUrl' to 'styleUrls'
})
export class ReserveRegistrationComponent implements OnInit {
  bookingForm: FormGroup;

  myFilter = (d: Date | null): boolean => {
    const day = (d || new Date()).getDay();
    // Prevent Saturday and Sunday from being selected.
    return day !== 0 && day !== 6;
  };

  constructor(private fb: FormBuilder) {
    this.bookingForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      birthday: [null, Validators.required], // changed to null for Date type
      document: [''],
      departure_date: ['', Validators.required],
      departure_iata: ['', Validators.required],
      arrival_iata: ['', Validators.required],
      arrival_date: ['', Validators.required],
    });
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    console.log('Form submitted:', this.bookingForm.value);
  }


}
