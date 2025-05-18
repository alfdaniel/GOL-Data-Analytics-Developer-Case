import { Component } from "@angular/core";
import { DashboardTableComponent } from "./dashboard-table/dashboard-table.component";
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { signal } from "@angular/core";
import { DashboardBarComponent } from "./dashboard-bar/dashboard-bar.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DashboardTableComponent, DashboardBarComponent, MatButtonModule, MatIconModule, CommonModule],
  template: `
      <div class="swap-control">
        <div class="icons" [style.flex-direction]="showChartsFirst() ? 'column-reverse' : 'column'">
          <mat-icon>bar_chart</mat-icon>
            <button mat-icon-button (click)="toggleOrder()" class="swap-button">
              <mat-icon>swap_vert</mat-icon>
            </button>
          <mat-icon>table_chart</mat-icon>
        </div>
      </div>
      <section class="dashboard-container" [style.flex-direction]="!showChartsFirst() ? 'column' : 'column-reverse'">
          <app-dashboard-bar></app-dashboard-bar>
          <app-dashboard-table></app-dashboard-table>
      </section>
  `,
  styles: [`
    .dashboard-container {
      width: 86%;
      max-width: 1800px;
      margin: 0 auto;
      margin-top: 30px;
      display: flex;
      position: relative;
    }

    .swap-control {
      right: 40px;
      position: fixed;
      top: 15%;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      padding: 8px;
      z-index: 1000;
    }

    .icons {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      color: rgba(0,0,0,0.6);
    }

    .swap-button {
      background: #f5f5f5;
      &:hover {
        background: #e0e0e0;
      }
    }
  `],
})

export class DashboardComponent {
  showChartsFirst = signal(false);

  toggleOrder() {
    this.showChartsFirst.set(!this.showChartsFirst());
  }
}

