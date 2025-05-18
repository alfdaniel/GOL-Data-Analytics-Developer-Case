import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule } from '@angular/material/sort';
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
import { DashboardService } from '@app/services/dashboard.service';
import { DateUtils } from '@app/shared/utils/date.utils';
import { TextUtils } from '@app/shared/utils/text.utils';

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string | string[];
    borderColor: string | string[];
    borderWidth: number;
  }[];
}

interface ChartDataPoint {
  category: string;
  value: number;
}

enum ChartType {
  Departures = 1,
  Arrivals = 2,
  Routes = 3
}


@Component({
  selector: 'app-dashboard-bar',
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
  ],
  templateUrl: './dashboard-bar.component.html',
  styleUrls: ['./dashboard-bar.component.scss']
})
export class DashboardBarComponent implements OnInit {
  private dashboardService: DashboardService = inject(DashboardService);
  private dateUtils: DateUtils = inject(DateUtils);
  private textUtils: TextUtils = inject(TextUtils);

  expandedChart = signal<string | null>(null);

  charts: { id: string; title: string; data: ChartData }[] = [];

  loading = false;
  error = false;

  loadingDepartures = false;
  loadingArrivals = false;
  loadingRoutes = false;
  loadingChart = false;

  barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' as const }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  departuresChart: ChartData = {
    labels: [],
    datasets: [{
      label: 'Partidas',
      data: [],
      backgroundColor: 'rgba(54, 162, 235, 0.5)',
      borderColor: 'rgb(54, 162, 235)',
      borderWidth: 1
    }]
  };

  arrivalsChart: ChartData = {
    labels: [],
    datasets: [{
      label: 'Chegadas',
      data: [],
      backgroundColor: 'rgba(75, 192, 192, 0.5)',
      borderColor: 'rgb(75, 192, 192)',
      borderWidth: 1
    }]
  };

  routesChart: ChartData = {
    labels: [],
    datasets: [{
      label: 'Passageiros por Rota',
      data: [],
      backgroundColor: [
        'rgba(255, 99, 132, 0.5)',
        'rgba(54, 162, 235, 0.5)',
        'rgba(255, 206, 86, 0.5)',
        'rgba(75, 192, 192, 0.5)',
        'rgba(153, 102, 255, 0.5)'
      ],
      borderColor: [
        'rgb(255, 99, 132)',
        'rgb(54, 162, 235)',
        'rgb(255, 206, 86)',
        'rgb(75, 192, 192)',
        'rgb(153, 102, 255)'
      ],
      borderWidth: 1
    }]
  };

  ngOnInit() {
    Promise.all([
      this.loadDeparturesChart(),
      this.loadArrivalsChart(),
      this.loadRoutesChart()
    ]).then(() => {
      this.charts = [
        { id: 'routes', title: 'Rotas', data: this.routesChart },
        { id: 'departures', title: 'Partidas', data: this.departuresChart },
        { id: 'arrivals', title: 'Chegadas', data: this.arrivalsChart }
      ];
    });
  }

  private async loadChart(
    chartRef: { labels: string[]; datasets: { data: number[] }[] },
    setLoading: (value: boolean) => void,
    chartType: number,
    labelFormatter: (label: string) => string
  ): Promise<void> {
    return new Promise<void>((resolve) => {
      setLoading(true);
      this.dashboardService.getChartData(chartType).pipe(
        catchError(error => {
          console.error('Erro ao carregar gráfico:', error);
          return of(null);
        }),
        finalize(() => setLoading(false))
      ).subscribe(res => {
        if (res?.data) {
          chartRef.labels = res.data.map((d: ChartDataPoint) => labelFormatter(d.category));
          chartRef.datasets[0].data = res.data.map((d: ChartDataPoint) => d.value);
        }
        resolve();
      });
    });
  }

  loadDeparturesChart() {
    return this.loadChart(
      this.departuresChart,
      (v) => this.loadingDepartures = v,
      ChartType.Departures,
      (label) => this.dateUtils.formatToDayMonth(label)
    );
  }


  loadArrivalsChart() {
    return this.loadChart(
      this.arrivalsChart,
      (v) => this.loadingArrivals = v,
      ChartType.Arrivals,
      (label) => this.dateUtils.formatToDayMonth(label)
    );
  }

  loadRoutesChart() {
    return this.loadChart(
      this.routesChart,
      (v) => this.loadingRoutes = v,
      ChartType.Routes,
      (label) => this.textUtils.formatOriginDestination(label)
    );
  }

  toggleChart(chartId: string) {
    this.expandedChart.set(this.expandedChart() === chartId ? null : chartId);
  }
}
