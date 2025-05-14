import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  showAlert(message: string, type: 'success' | 'error' | 'info' = 'info') {
    Swal.fire({
      title: message,
      icon: type,
      timer: 3000,
      timerProgressBar: true,
      showConfirmButton: false,
      position: 'top-end',
      toast: true,
      width: 'auto',
      padding: '1em',
      color: '#716add',
      background: '#fff'
    });
  }

  showAlertSuccess(title: string) {
    Swal.fire({
      position: "top-end",
      icon: "success",
      title,
      showConfirmButton: false,
      timer: 2000
    })
  };

  confirmAlert(title: string, text: string, confirmButtonText: string = "Sim",
    cancelButtonText: string = "Não", icon: 'question' | 'warning' | 'error' | 'success' = 'warning') {
    return Swal.fire({
      title,
      text,
      icon: icon || 'question',
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText,
      cancelButtonText
    });
  }
}


