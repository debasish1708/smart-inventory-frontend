import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, ProfileResponse } from '../models/auth.models';

export interface UpdateProfileRequest {
  firstName: string; lastName: string; businessName: string; businessType?: string;
  mobNo: string; address: string; gst?: string; city: string; state: string; pincode: string; profileImageUrl?: string;
}

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private baseUrl = `${environment.apiUrl}/profile`;
  constructor(private http: HttpClient) {}

  getMyProfile(): Observable<ApiResponse<ProfileResponse>> {
    return this.http.get<ApiResponse<ProfileResponse>>(`${this.baseUrl}/me`);
  }

  getProfileById(userId: number): Observable<ApiResponse<ProfileResponse>> {
    return this.http.get<ApiResponse<ProfileResponse>>(`${environment.apiUrl}/admin/user-profile/${userId}`);
  }

  completeProfile(req: UpdateProfileRequest): Observable<ApiResponse<ProfileResponse>> {
    return this.http.post<ApiResponse<ProfileResponse>>(`${this.baseUrl}/complete`, req);
  }

  updateProfile(req: UpdateProfileRequest): Observable<ApiResponse<ProfileResponse>> {
    return this.http.put<ApiResponse<ProfileResponse>>(`${this.baseUrl}/update`, req);
  }
}
