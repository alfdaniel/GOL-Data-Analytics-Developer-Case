import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface Booking {
  id: number;
  first_name: string;
  last_name: string;
  document: string;
  birthday: Date;
  departure_date: Date;
  departure_iata: string;
  arrival_date: Date;
  arrival_iata: string;
  created_at: string;
  updated_at: string;
  status?: string;
}

export interface BookingResponse {
  count: number;
  limit: number;
  data: Booking[];
}

export interface TokenValidationResponse {
  valid: boolean;
  message?: string;
}

interface ChartResponse {
  labels: string[];
  values: number[];
}

interface DashboardData {
  date: string;
  route: string;
  departures: number;
  arrivals: number;
}

interface UploadPayload {
  content: string;
  document: string;
}

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = `${environment.apiUrl}/api/v1/booking`;
  private apiUrlDashboard = `${environment.apiUrl}/api/v1/dashboard`;
  private defaultLimit = 10;

  constructor(private http: HttpClient) {}

  // Buscar todas as reservas
  getAllBookings(limit: number = 10): Observable<BookingResponse> {
    const url = `${this.apiUrl}/?limit=${limit}`;
    return this.http.get<BookingResponse>(url);
  }

  // Criar nova reserva
  createBooking(booking: Booking): Observable<Booking> {
    return this.http.post<Booking>(this.apiUrl, booking);
  }

  // Download do arquivo de reservas
  downloadBookings(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/file/download`, {
      responseType: 'blob'
    });
  }

  // Upload do arquivo de reservas
  uploadBookings(payload: FormData ): Observable<any> {
    const formData = new FormData();
    return this.http.post(`${this.apiUrl}/file/upload`, payload);
  }

  getChartData(limit: number = 10): Observable<ChartResponse> {
    return this.http.get<ChartResponse>(`${this.apiUrlDashboard}/chart/data/1/?limit=${limit}`);
  }

  getDashboardData(): Observable<DashboardData[]> {
    return this.http.get<DashboardData[]>(`${this.apiUrlDashboard}/data`);
  }
}
