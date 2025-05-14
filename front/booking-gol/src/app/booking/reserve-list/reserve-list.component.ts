import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule, MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { BookingService, Booking, BookingResponse } from '../../services/booking.service';
import { catchError, finalize, of } from 'rxjs';
import { NotificationService } from '../../shared/notification';
import moment from 'moment';

@Component({
  selector: 'app-reserve-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatCardModule,
    RouterModule,
    DatePipe
  ],
  templateUrl: './reserve-list.component.html',
  styleUrls: ['./reserve-list.component.scss']
})
export class ReserveListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = [
    'first_name',
    'last_name',
    'departure_iata',
    'departure_date',
    'arrival_iata',
    'arrival_date'
  ];
  dataSource: Booking[] = [];
  loading = false;
  error = false;

  // Paginação
  totalItems = 0;
  pageSize = 10;
  pageSizeOptions = [5, 10, 25, 50];
  currentPage = 0;

  constructor(
    private bookingService: BookingService,
    private notification: NotificationService
  ) {}

  ngOnInit() {
    this.loadBookings();
  }

  formatDate(date: string): Date {
    return moment(date, 'DD-MM-YYYY').toDate();
  }

  loadBookings() {
    this.loading = true;
    this.error = false;

    this.bookingService.getAllBookings(this.pageSize)
      .pipe(
        catchError(error => {
          console.error('Erro ao carregar reservas:', error);
          this.error = true;
          this.notification.showAlert('Erro ao carregar reservas.', 'error');
          return of(null);
        }),
        finalize(() => this.loading = false)
      )
      .subscribe(response => {
        console.log('response', response)
        if (response) {
          this.dataSource = response.data;
          this.totalItems = response.count;
        }
      });
  }

  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.loadBookings();
  }
}
