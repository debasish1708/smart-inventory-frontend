import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login', standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = ''; password = ''; showPass = false;
  loading = false; submitted = false; error = '';

  constructor(private auth: AuthService, private router: Router) {}

  login() {
    this.submitted = true; this.error = '';
    if (!this.email || !this.password) return;
    this.loading = true;
    this.auth.login({ email: this.email, password: this.password }).subscribe({
      next: res => {
        this.loading = false;
        if (res.success) {
          const role = res.data.role;
          if (role === 'ADMIN')         this.router.navigate(['/admin/dashboard']);
          else if (role === 'RETAILER') this.router.navigate(['/retailer/dashboard']);
          else if (role === 'SUPPLIER') this.router.navigate(['/supplier/dashboard']);
        } else { this.error = res.message; }
      },
      error: err => { this.loading = false; this.error = err.error?.message || 'Login failed.'; }
    });
  }
}
