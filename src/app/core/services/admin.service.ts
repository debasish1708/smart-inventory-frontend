import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AdminStats, AdminUser, ApiResponse } from '../models/auth.models';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private baseUrl = `${environment.apiUrl}/admin`;
  constructor(private http: HttpClient) {}

  getStats(): Observable<ApiResponse<AdminStats>> {
    return this.http.get<ApiResponse<AdminStats>>(`${this.baseUrl}/stats`);
  }

  getAllUsers(): Observable<ApiResponse<AdminUser[]>> {
    return this.http.get<ApiResponse<AdminUser[]>>(`${this.baseUrl}/all-users-raw`);
  }

  getPendingUsers(): Observable<ApiResponse<AdminUser[]>> {
    return this.http.get<ApiResponse<AdminUser[]>>(`${this.baseUrl}/pending-users`);
  }

  approveUser(id: number): Observable<ApiResponse<string>> {
    return this.http.put<ApiResponse<string>>(`${this.baseUrl}/approve/${id}`, {});
  }

  blockUser(id: number): Observable<ApiResponse<string>> {
    return this.http.put<ApiResponse<string>>(`${this.baseUrl}/block/${id}`, {});
  }

  unblockUser(id: number): Observable<ApiResponse<string>> {
    return this.http.put<ApiResponse<string>>(`${this.baseUrl}/unblock/${id}`, {});
  }

  deleteUser(id: number): Observable<ApiResponse<string>> {
    return this.http.delete<ApiResponse<string>>(`${this.baseUrl}/delete/${id}`);
  }
}
