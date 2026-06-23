import { Component, Input } from '@angular/core';
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

  constructor(private auth: AuthService) {}

  get email()    { return this.auth.getCurrentUser()?.email ?? ''; }
  get role()     { return this.auth.getCurrentUser()?.role ?? ''; }
  get initials() { return this.email.slice(0, 2).toUpperCase(); }
}
