import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateUtils {

  formatToDayMonth(raw: string | Date | null | undefined): string {
    if (!raw) return '-';

    try {
      const date = new Date(raw);
      if (!isNaN(date.getTime())) {
        const day = String(date.getUTCDate()).padStart(2, '0');
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        return `${day}/${month}`;
      }

      if (typeof raw === 'string') {
        const match = raw.match(/^(\d{2})[\/-](\d{2})[\/-](\d{4})$/);
        if (match) {
          const [, day, month] = match;
          return `${day}/${month}`;
        }
      }

      return '-';
    } catch {
      return '-';
    }
  }

  formatToDayMonthYear(raw: string | Date | null | undefined): string {
    if (!raw) return '-';

    try {
      const date = new Date(raw);
      if (!isNaN(date.getTime())) {
        const day = String(date.getUTCDate()).padStart(2, '0');
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const year = String(date.getUTCFullYear());
        return `${day}/${month}/${year}`;
      }

      if (typeof raw === 'string') {
        const match = raw.match(/^(\d{2})[\/-](\d{2})[\/-](\d{4})$/);
        if (match) {
          const [, day, month, year] = match;
          return `${day}/${month}/${year}`;
        }
      }

      return '-';
    } catch {
      return '-';
    }
  }

}
