import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { BookingResponse, Booking } from '@app/interfaces/booking.interface';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = `${environment.apiUrl}/api/v1/booking`;

  constructor(private http: HttpClient) {}

  getAllBookings(limit: number = 5000): Observable<BookingResponse> {
    const url = `${this.apiUrl}/?limit=${limit}`;
    return this.http.get<BookingResponse>(url);
  }

  createBooking(booking: Booking): Observable<Booking> {
    return this.http.post<Booking>(this.apiUrl, booking);
  }

  downloadBookings(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/file/download`, {
      responseType: 'blob'
    });
  }

  uploadBookings(payload: FormData ): Observable<any> {
    const formData = new FormData();
    return this.http.post(`${this.apiUrl}/file/upload`, payload);
  }
}
