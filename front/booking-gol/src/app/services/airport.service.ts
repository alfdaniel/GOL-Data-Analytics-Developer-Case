import { Injectable, signal } from '@angular/core';

export interface Airport {
  code: string;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class AirportService {
  private readonly airports = signal<Airport[]>([
    { code: 'GRU', name: 'São Paulo/Guarulhos (GRU)' },
    { code: 'BSB', name: 'Brasília (BSB)' },
    { code: 'GIG', name: 'Rio de Janeiro/Galeão (GIG)' },
    { code: 'CGH', name: 'São Paulo/Congonhas (CGH)' },
    { code: 'SSA', name: 'Salvador (SSA)' },
    { code: 'REC', name: 'Recife (REC)' },
    { code: 'POA', name: 'Porto Alegre (POA)' },
    { code: 'NAT', name: 'Natal (NAT)' },
    { code: 'FOR', name: 'Fortaleza (FOR)' },
    { code: 'BEL', name: 'Belém (BEL)' },
    { code: 'VIX', name: 'Vitória (VIX)' },
    { code: 'CWB', name: 'Curitiba (CWB)' },
    { code: 'FLN', name: 'Florianópolis (FLN)' },
    { code: 'MAO', name: 'Manaus (MAO)' },
    { code: 'GYN', name: 'Goiânia (GYN)' }
  ]);

  readonly airportsList = this.airports.asReadonly();

  getAirportByCode(code: string): Airport | undefined {
    return this.airports().find(airport => airport.code === code);
  }
}
