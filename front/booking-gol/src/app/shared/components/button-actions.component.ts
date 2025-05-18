import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-button-actions',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
     <button mat-raised-button color="primary" (click)="handler.emit()">
        <mat-icon>{{icon()}}</mat-icon>
        {{label()}}
      </button>
  `,
  styles: [``]
})
export class ButtonActionsComponent {
  icon = input<string>('');
  label = input<string>('');
  handler = output<void>();
}
