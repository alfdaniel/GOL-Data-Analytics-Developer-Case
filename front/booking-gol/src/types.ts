// Tipos para Booking
export interface Booking {
    id?: number;
    first_name: string;
    last_name: string;
    birthday: string;
    document: string;
    departure_date: string;
    departure_iata: string;
    arrival_iata: string;
    arrival_date: string;
    created_at?: string; // datetime como string
    updated_at?: string; // datetime como string
}

export interface BookingResponse {
    count: number;
    limit: number;
    data: Booking[];
}

export interface BookingCreate {
    first_name: string;
    last_name: string;
    birthday: string;
    document: string;
    departure_date: string;
    departure_iata: string;
    arrival_iata: string;
    arrival_date: string;
}

export interface BookingFileResponse {
    rows: number;
}

// Tipos para Dashboard
export interface DashboardChartData {
    category: string;
    value: number;
}

export interface DashboardChartResponse {
    count: number;
    limit: number;
    data: DashboardChartData[];
}

export interface DashboardData {
    date: string;
    iatapair: string;
    departures: number;
    arrivals: number;
}

export interface DashboardDataResponse {
    count: number;
    limit: number;
    data: DashboardData[];
} 