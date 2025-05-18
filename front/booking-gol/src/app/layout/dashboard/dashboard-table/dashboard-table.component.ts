import { Component, OnInit, ViewChild, AfterViewInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule, MatSort, Sort } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { NgChartsModule } from 'ng2-charts';
import { catchError, finalize, of } from 'rxjs';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { DashboardService } from '@app/services/dashboard.service';
import { DateUtils } from '@app/shared/utils/date.utils';
import { TextUtils } from '@app/shared/utils/text.utils';
import { NotificationService } from '@app/shared/notification';

interface DashboardData {
  // id?: number;
  date: string;
  iatapair: string;
  departures: number;
  arrivals: number;
}

@Component({
  selector: 'app-dashboard-table',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    FormsModule,
    NgChartsModule,
    MatPaginatorModule
  ],
  templateUrl: './dashboard-table.component.html',
  styleUrls: ['./dashboard-table.component.scss']
})
export class DashboardTableComponent implements OnInit {
  private dateUtils: DateUtils = inject(DateUtils);
  private textUtils: TextUtils = inject(TextUtils);
  private notification: NotificationService = inject(NotificationService);
  private dashboardService: DashboardService = inject(DashboardService);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  bookings = new MatTableDataSource<DashboardData>([]);
  loading = false;
  error = false;
  errorMessage = '';

  totalItems = 0;
  pageSize = 5;
  pageSizeOptions = [5, 10, 25, 50];
  currentPage = 0;

  displayedColumns: string[] = ['date', 'iatapair', 'departures', 'arrivals'];

  ngOnInit() {
    this.setupFilterPredicate();
    this.loadTableData();
  }

  ngAfterViewInit() {
    this.bookings.paginator = this.paginator;
    this.bookings.sort = this.sort;

    this.bookings.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'date':
          return new Date(item.date);
      }
      return (item as any)[property];
    };
  }

  setupFilterPredicate() {
    this.bookings.filterPredicate = (data: DashboardData, filter: string) => {
      const searchStr = filter.trim().toLowerCase();

      const iataPair = data.iatapair.toLowerCase().includes(searchStr);
      const departures = data.departures.toString().toLowerCase().includes(searchStr);
      const arrivals = data.arrivals.toString().toLowerCase().includes(searchStr);
      const date = this.formatDate(data.date).toLowerCase().includes(searchStr);

      return iataPair || departures || arrivals || date;
    };
  }

  loadTableData() {
    this.loading = true;
    this.error = false;
    this.errorMessage = '';

    this.dashboardService.getDashboardData(this.pageSize).pipe(
      catchError(error => {
        this.error = true;
        this.errorMessage = 'Erro ao carregar rotas.';
        this.notification.showAlert(this.errorMessage, 'error');
        return of(null);
      }),
      finalize(() => this.loading = false)
    ).subscribe(res => {
      if (res) {
        const processedData = res.data.map((booking: DashboardData) => ({
          ...booking,
          formatted_iatapair: this.textUtils.formatOriginDestination(booking.iatapair),
          formatted_date: this.formatDate(booking.date)
        }));

        this.bookings.data = processedData;
        this.totalItems = res.count;
      }
    });
  }

  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.loadTableData();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim();
    this.bookings.filter = filterValue;
  }

  formatDate(date: string | Date | null | undefined): string {
    return this.dateUtils.formatToDayMonthYear(date);
  }
}
