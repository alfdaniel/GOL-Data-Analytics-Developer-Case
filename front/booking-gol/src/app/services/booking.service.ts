import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface Booking {
  id: number;
  first_name: string;
  last_name: string;
  birthday: string;
  document: string;
  departure_date: string;
  departure_iata: string;
  arrival_iata: string;
  arrival_date: string;
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

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = `${environment.apiUrl}/api/v1/booking`;
  private defaultLimit = 10;

  constructor(private http: HttpClient) {}

  validateToken(token: string): Observable<TokenValidationResponse> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<TokenValidationResponse>(`${this.apiUrl}/validate-token`, { headers });
  }

  // Buscar todas as reservas
  getAllBookings(limit: number = 10): Observable<BookingResponse> {
    const url = `${this.apiUrl}/?limit=${limit}`;
    return this.http.get<BookingResponse>(url);
  }

  // Criar nova reserva
  createBooking(booking: Omit<Booking, 'id'>): Observable<Booking> {
    return this.http.post<Booking>(this.apiUrl, booking);
  }

  // Download do arquivo de reservas
  downloadBookings(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/file/download`, {
      responseType: 'blob'
    });
  }

  // Upload do arquivo de reservas
  uploadBookings(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.apiUrl}/file/upload`, formData);
  }
}
