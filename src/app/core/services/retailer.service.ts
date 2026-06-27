import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, Order, Rating, InventoryItem, SupplierMatch, AnalyticsResponse, SubscriptionResponse } from '../models/auth.models';

@Injectable({ providedIn: 'root' })
export class RetailerService {
  private base = `${environment.apiUrl}/retailer`;
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
  createOrder(data: any): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.base}/orders`, data);
  }

  // Products Autocomplete
  getProducts(): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${environment.apiUrl}/catalog/products`);
  }

  // Supplier Match
  getAllSupplierMatches(): Observable<ApiResponse<SupplierMatch[]>> {
    return this.http.get<ApiResponse<SupplierMatch[]>>(`${this.base}/supplier-match/all`);
  }
  getSupplierMatches(productId: number): Observable<ApiResponse<SupplierMatch[]>> {
    return this.http.get<ApiResponse<SupplierMatch[]>>(`${this.base}/supplier-match?productId=${productId}`);
  }

  // Ratings
  getRatings(): Observable<ApiResponse<Rating[]>> {
    return this.http.get<ApiResponse<Rating[]>>(`${this.base}/ratings`);
  }

  // Notifications
  getNotifications(): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${this.base}/notifications`);
  }

  // Analytics
  getAnalytics(): Observable<ApiResponse<AnalyticsResponse>> {
    return this.http.get<ApiResponse<AnalyticsResponse>>(`${this.base}/analytics`);
  }

  // Subscription
  getSubscription(): Observable<ApiResponse<SubscriptionResponse>> {
    return this.http.get<ApiResponse<SubscriptionResponse>>(`${this.base}/subscription`);
  }
  upgradeSubscription(planName: string): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.base}/subscription/upgrade?plan=${planName}`, {});
  }

  // Sales (POS)
  submitSale(data: any): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.base}/sales`, data);
  }
  getSales(page: number = 0, size: number = 10): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.base}/sales?page=${page}&size=${size}`);
  }
  getTodaySalesSummary(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.base}/sales/today-summary`);
  }
}
