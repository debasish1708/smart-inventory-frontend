import { Component, Input, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { ProfileService } from '../../../core/services/profile.service';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css']
})
export class TopbarComponent implements OnInit {
  @Input() pageTitle = '';
  dropdownOpen = false;
  profile: any = null;

  constructor(private auth: AuthService, private profileSvc: ProfileService) {}

  ngOnInit() {
    this.profileSvc.getMyProfile().subscribe({
      next: r => {
        if (r.success && r.data) {
          this.profile = r.data;
        }
      }
    });
  }

  get email()    { return this.auth.getCurrentUser()?.email ?? ''; }
  get role()     { return this.auth.getCurrentUser()?.role ?? ''; }
  get initials() { return this.email.slice(0, 2).toUpperCase(); }

  getImgUrl(filename: string): string {
    return this.profileSvc.getProfileImageUrl(this.profile?.role ?? 'retailer', filename);
  }

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
