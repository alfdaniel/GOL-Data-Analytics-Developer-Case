
export interface Booking {
  id: number;
  first_name: string;
  last_name: string;
  document: string;
  birthday: string;
  departure_date: string;
  departure_iata: string;
  arrival_date: string;
  arrival_iata: string;
  created_at: string;
  updated_at: string;
  status?: string;
  sort?: string;
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

export interface Bookings {
  count: number;
  data: Booking[];
  columns: any;
}

export interface Booking {
  id: number;
  first_name: string;
  last_name: string;
  document: string;
  birthday: string;
  departure_date: string;
  departure_iata: string;
  arrival_date: string;
  arrival_iata: string;
  created_at: string;
  updated_at: string;
  status?: string;
  sort?: string;
}