import { Component, signal } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule, Router } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { MENU_ITEMS, MenuItem } from '@app/config/menu.config';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    MatSidenavModule,
    MatListModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    RouterModule,
    CommonModule
  ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  isLargeScreen = true;
  sidebarCollapsed = false;
  openSubmenu: string | null = null;

  isSideNavCollapsed = signal(true);

  menuItems = signal<MenuItem[]>(MENU_ITEMS);

  constructor(
    breakpointObserver: BreakpointObserver,
    public router: Router
  ) {
    breakpointObserver.observe([Breakpoints.Handset])
      .subscribe(result => {
        this.isLargeScreen = !result.matches;
      });
  }

  sideNavCollapsed() {
    return this.isSideNavCollapsed();
  }

  toggleSideNav() {
    this.isSideNavCollapsed.update(value => !value);
  }

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  toggleSubmenu(label: string) {
    this.openSubmenu = this.openSubmenu === label ? null : label;
  }

  getTitleUrl() {
    return this.router.url.split('/').pop()?.replace(/-/g, ' ').toUpperCase();
  }
}
