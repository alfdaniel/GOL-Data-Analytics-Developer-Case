import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class TextUtils {

  formatOriginDestination (string: string): string {
    const middle = Math.floor(string.length / 2);
    return string.slice(0, middle) + ' - ' + string.slice(middle);
  }

}
