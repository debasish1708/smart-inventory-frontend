import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { ApiResponse, AuthResponse, LoginRequest, ProfileResponse, RegisterRequest, VerifyOtpRequest } from '../models/auth.models';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient, private router: Router) {}

  register(req: RegisterRequest): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(`${this.baseUrl}/auth/register`, req);
  }

  verifyOtp(req: VerifyOtpRequest): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(`${this.baseUrl}/auth/verify-otp`, req);
  }

  resendOtp(email: string): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(`${this.baseUrl}/auth/resend-otp?email=${email}`, {});
  }

  login(req: LoginRequest): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.baseUrl}/auth/login`, req).pipe(
      tap(res => {
        if (res.success && res.data) {
          localStorage.setItem('token', res.data.token);
          localStorage.setItem('user', JSON.stringify(res.data));
        }
      })
    );
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/auth/login']);
  }

  getToken(): string | null { return localStorage.getItem('token'); }

  getCurrentUser(): AuthResponse | null {
    const u = localStorage.getItem('user');
    return u ? JSON.parse(u) : null;
  }

  isLoggedIn(): boolean { return !!this.getToken(); }

  getRole(): string { return this.getCurrentUser()?.role ?? ''; }

  isAdmin(): boolean { return this.getRole() === 'ADMIN'; }

  updateUserCache(partial: Partial<AuthResponse>): void {
    const u = this.getCurrentUser();
    if (u) localStorage.setItem('user', JSON.stringify({ ...u, ...partial }));
  }
}
