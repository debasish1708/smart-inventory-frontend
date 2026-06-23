import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

export interface NavItem {
  label: string; icon: string; route: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  @Input() navItems: NavItem[] = [];
  @Input() roleLabel = '';

  constructor(private auth: AuthService) {}

  get email() { return this.auth.getCurrentUser()?.email ?? ''; }
  get role()  { return this.auth.getCurrentUser()?.role ?? ''; }

  logout() { this.auth.logout(); }
}
