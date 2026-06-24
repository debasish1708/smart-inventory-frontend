import { Component, Input, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css']
})
export class TopbarComponent {
  @Input() pageTitle = '';
  dropdownOpen = false;

  constructor(private auth: AuthService) {}

  get email()    { return this.auth.getCurrentUser()?.email ?? ''; }
  get role()     { return this.auth.getCurrentUser()?.role ?? ''; }
  get initials() { return this.email.slice(0, 2).toUpperCase(); }

  toggleDropdown() { this.dropdownOpen = !this.dropdownOpen; }

  logout() { this.dropdownOpen = false; this.auth.logout(); }

  @HostListener('document:click', ['$event'])
  onDocumentClick(e: MouseEvent) {
    const target = e.target as HTMLElement;
    if (!target.closest('.user-area')) {
      this.dropdownOpen = false;
    }
  }
}
