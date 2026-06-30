import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, Order, Rating, InventoryItem, AnalyticsResponse, SubscriptionResponse, SupplierAnalyticsResponse } from '../models/auth.models';

@Injectable({ providedIn: 'root' })
export class SupplierService {
  private base = `${environment.apiUrl}/supplier`;
  constructor(private http: HttpClient) {}

  // Inventory
  getInventory(): Observable<ApiResponse<InventoryItem[]>> {
    return this.http.get<ApiResponse<InventoryItem[]>>(`${this.base}/inventory`);
  }
  addInventory(data: any): Observable<ApiResponse<InventoryItem>> {
    return this.http.post<ApiResponse<InventoryItem>>(`${this.base}/inventory`, data);
  }
  updateInventory(id: number, data: any): Observable<ApiResponse<InventoryItem>> {
    return this.http.put<ApiResponse<InventoryItem>>(`${this.base}/inventory/${id}`, data);
  }
  deleteInventory(id: number): Observable<ApiResponse<string>> {
    return this.http.delete<ApiResponse<string>>(`${this.base}/inventory/${id}`);
  }

  // Orders
  getOrders(): Observable<ApiResponse<Order[]>> {
    return this.http.get<ApiResponse<Order[]>>(`${this.base}/orders`);
  }
  updateOrderStatus(id: number, status: string): Observable<ApiResponse<string>> {
    return this.http.put<ApiResponse<string>>(`${this.base}/orders/${id}/status?status=${status}`, {});
  }

  // Ratings
  getRatings(): Observable<ApiResponse<Rating[]>> {
    return this.http.get<ApiResponse<Rating[]>>(`${this.base}/ratings`);
  }

  // Analytics
  getAnalytics(): Observable<ApiResponse<SupplierAnalyticsResponse>> {
    return this.http.get<ApiResponse<SupplierAnalyticsResponse>>(`${this.base}/analytics`);
  }

  // Subscription
  getSubscription(): Observable<ApiResponse<SubscriptionResponse>> {
    return this.http.get<ApiResponse<SubscriptionResponse>>(`${this.base}/subscription`);
  }
  upgradeSubscription(planName: string): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.base}/subscription/upgrade?plan=${planName}`, {});
  }

  // Report
  getReport(): Observable<ApiResponse<Order[]>> {
    return this.http.get<ApiResponse<Order[]>>(`${this.base}/report`);
  }
}
