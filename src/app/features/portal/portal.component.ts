import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

interface StrengthResult {
  score: number;
  label: string;
  color: string;
  percent: number;
}

@Component({
  selector: 'app-portal',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './portal.component.html',
  styleUrls: ['./portal.component.css']
})
export class PortalComponent {
  // Navigation & Modal state
  showAuthModal = false;
  authMode: 'login' | 'register' = 'login';

  // Login attributes
  email = '';
  password = '';
  showPass = false;
  loginLoading = false;
  loginSubmitted = false;
  loginError = '';

  // Register attributes
  regEmail = '';
  regPassword = '';
  regConfirmPassword = '';
  regRole = '';
  regShowPass = false;
  regShowConfirm = false;
  regLoading = false;
  regSubmitted = false;
  regError = '';
  regSuccess = '';

  strength: StrengthResult = { score: 0, label: 'Too Weak', color: '#e53935', percent: 5 };
  checks = { length: false, upper: false, lower: false, number: false, special: false };

  constructor(private auth: AuthService, private router: Router) {}

  // Register form validation getters
  get regEmailErr() {
    if (!this.regEmail) return 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.regEmail)) return 'Invalid email format';
    return '';
  }

  get regPassErr() {
    if (!this.regPassword) return 'Password is required';
    if (this.regPassword.length < 6) return 'Minimum 6 characters required';
    return '';
  }

  get regConfirmErr() {
    if (!this.regConfirmPassword) return 'Please confirm your password';
    if (this.regPassword !== this.regConfirmPassword) return 'Passwords do not match';
    return '';
  }

  onPasswordInput() {
    const p = this.regPassword;
    this.checks = {
      length: p.length >= 6,
      upper: /[A-Z]/.test(p),
      lower: /[a-z]/.test(p),
      number: /[0-9]/.test(p),
      special: /[^A-Za-z0-9]/.test(p)
    };
    const score = Object.values(this.checks).filter(Boolean).length;
    const map: Record<number, StrengthResult> = {
      0: { score: 0, label: 'Too Weak', color: '#e53935', percent: 5 },
      1: { score: 1, label: 'Weak', color: '#f57c00', percent: 25 },
      2: { score: 2, label: 'Fair', color: '#fbc02d', percent: 50 },
      3: { score: 3, label: 'Good', color: '#7cb342', percent: 75 },
      4: { score: 4, label: 'Strong', color: '#2e7d32', percent: 90 },
      5: { score: 5, label: 'Very Strong', color: '#1b5e20', percent: 100 }
    };
    this.strength = map[score] ?? map[0];
  }

  openAuth() {
    this.showAuthModal = true;
    this.authMode = 'login';
    this.resetForms();
  }

  closeAuth() {
    this.showAuthModal = false;
    this.resetForms();
  }

  private resetForms() {
    this.email = '';
    this.password = '';
    this.showPass = false;
    this.loginLoading = false;
    this.loginSubmitted = false;
    this.loginError = '';

    this.regEmail = '';
    this.regPassword = '';
    this.regConfirmPassword = '';
    this.regRole = '';
    this.regShowPass = false;
    this.regShowConfirm = false;
    this.regLoading = false;
    this.regSubmitted = false;
    this.regError = '';
    this.regSuccess = '';
    this.strength = { score: 0, label: 'Too Weak', color: '#e53935', percent: 5 };
    this.checks = { length: false, upper: false, lower: false, number: false, special: false };
  }

  login() {
    this.loginSubmitted = true;
    this.loginError = '';
    if (!this.email || !this.password) return;
    this.loginLoading = true;

    this.auth.login({ email: this.email, password: this.password }).subscribe({
      next: res => {
        this.loginLoading = false;
        if (res.success) {
          this.closeAuth();
          const role = res.data.role;
          if (role === 'ADMIN')         this.router.navigate(['/admin/dashboard']);
          else if (role === 'RETAILER') this.router.navigate(['/retailer/dashboard']);
          else if (role === 'SUPPLIER') this.router.navigate(['/supplier/dashboard']);
        } else {
          this.loginError = res.message;
        }
      },
      error: err => {
        this.loginLoading = false;
        this.loginError = err.error?.message || 'Login failed.';
      }
    });
  }

  register() {
    this.regSubmitted = true;
    this.regError = '';
    this.regSuccess = '';

    if (this.regEmailErr || this.regPassErr || this.regConfirmErr || !this.regRole) return;
    this.regLoading = true;

    this.auth.register({
      email: this.regEmail,
      password: this.regPassword,
      role: this.regRole
    }).subscribe({
      next: res => {
        this.regLoading = false;
        if (res.success) {
          this.regSuccess = 'OTP sent to your email!';
          const targetEmail = this.regEmail;
          setTimeout(() => {
            this.closeAuth();
            this.router.navigate(['/auth/verify-otp'], { queryParams: { email: targetEmail } });
          }, 1500);
        } else {
          this.regError = res.message;
        }
      },
      error: err => {
        this.regLoading = false;
        this.regError = err.error?.message || 'Registration failed.';
      }
    });
  }
}
