import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { BookingResponse } from "../interfaces/booking.interface";
import { environment } from "../../environments/environment";

interface DashboardResponse {
  data: DashboardData[];
  count: number;
}

interface DashboardData {
  date: string;
  iatapair: string;
  departures: number;
  arrivals: number;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  constructor(private http: HttpClient) {}

  private apiUrlDashboard = `${environment.apiUrl}/api/v1/dashboard`;

  getChartData(chartNunmber: number, limit: number = 5000): Observable<any> {
    return this.http.get<any>(`${this.apiUrlDashboard}/chart/data/${chartNunmber}/?limit=${limit}`);
  }

  getDashboardData(limit: number = 5000): Observable<DashboardResponse> {
    return this.http.get<DashboardResponse>(`${this.apiUrlDashboard}/data/?limit=${limit}`);
  }
}
