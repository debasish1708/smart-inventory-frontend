import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, CatalogCategory, CatalogProduct } from '../models/auth.models';

@Injectable({ providedIn: 'root' })
export class CatalogService {
  private base = `${environment.apiUrl}/catalog`;
  constructor(private http: HttpClient) {}

  getCategories(): Observable<ApiResponse<CatalogCategory[]>> {
    return this.http.get<ApiResponse<CatalogCategory[]>>(`${this.base}/categories`);
  }

  getProducts(categoryId?: number): Observable<ApiResponse<CatalogProduct[]>> {
    const url = categoryId
      ? `${this.base}/products?categoryId=${categoryId}`
      : `${this.base}/products`;
    return this.http.get<ApiResponse<CatalogProduct[]>>(url);
  }
}
