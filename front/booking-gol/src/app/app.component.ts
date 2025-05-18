import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent],
  template: `
    <app-sidebar>
      <router-outlet></router-outlet>
    </app-sidebar>
  `,
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor() {
    console.log('Current environment:', environment);
  }
}
