import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { catchError, finalize, of } from 'rxjs';
import { NotificationService } from '../../../shared/notification';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DateUtils } from '@app/shared/utils/date.utils';
import { Booking } from '@app/interfaces/booking.interface';
import { BookingService } from '@app/services/booking.service';

@Component({
  selector: 'app-bookings-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatCardModule,
    RouterModule,
    MatFormField,
    MatLabel,
    MatInputModule,
  ],
  templateUrl: './bookings-list.component.html',
  styleUrls: ['./bookings-list.component.scss']
})
export class BookingsListComponent implements OnInit, AfterViewInit {
  private bookingService: BookingService = inject(BookingService);
  private notification: NotificationService = inject(NotificationService);
  private dateUtils: DateUtils = inject(DateUtils);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = [
    'first_name',
    'departure_iata',
    'departure_date',
    'arrival_iata',
    'arrival_date'
  ];

  bookings = new MatTableDataSource<Booking>([]);
  loading = false;
  error = false;
  errorMessage = '';

  pageSize = 10;
  currentPage = 0;
  totalItems = 0;
  pageSizeOptions = [5, 10, 25, 50];

  ngOnInit() {
    this.setupFilterPredicate();
    this.loadBookings();
  }

  ngAfterViewInit() {
    this.bookings.paginator = this.paginator;
    this.bookings.sort = this.sort;

    this.bookings.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'departure_date':
          return new Date(item.departure_date);
        case 'arrival_date':
          return new Date(item.arrival_date);
        default:
          return (item as any)[property];
      }
    };
  }

  setupFilterPredicate() {
    this.bookings.filterPredicate = (data: Booking, filter: string) => {
      const searchStr = filter.trim().toLowerCase();

      const departureDate = this.formatDate(data.departure_date).toLowerCase().includes(searchStr);
      const arrivalDate = this.formatDate(data.arrival_date).toLowerCase().includes(searchStr);
      const firstName = data.first_name.toLowerCase().includes(searchStr);
      const departureIata = data.departure_iata.toLowerCase().includes(searchStr);
      const arrivalIata = data.arrival_iata.toLowerCase().includes(searchStr);

      return (
        departureDate || arrivalDate || firstName || departureIata || arrivalIata
      );
    };
  }

  loadBookings() {
    this.loading = true;
    this.error = false;
    this.errorMessage = '';

    this.bookingService.getAllBookings(this.pageSize)
      .pipe(
        catchError(error => {
          this.error = true;
          this.errorMessage = 'Erro ao carregar reservas.';
          this.notification.showAlert(this.errorMessage, 'error');
          return of(null);
        }),
        finalize(() => this.loading = false)
      )
      .subscribe(res => {
        if (res) {
          console.log(res);
          const processedData = res.data.map(booking => ({
            ...booking,
            formatted_departure_date: this.formatDate(booking.departure_date),
            formatted_arrival_date: this.formatDate(booking.arrival_date),
          }));

          this.bookings.data = processedData;
          this.totalItems = res.count;
        }
      });
  }

  onPageChange(event: { pageIndex: number; pageSize: number }): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.loadBookings();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim();
    this.bookings.filter = filterValue;
  }

  formatDate(date: string | Date | null | undefined): string {
    return this.dateUtils.formatToDayMonthYear(date);
  }
}
