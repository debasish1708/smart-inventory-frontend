import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from '../../../shared/components/layout/layout.component';
import { SupplierService } from '../../../core/services/supplier.service';
import { SupplierAnalyticsResponse } from '../../../core/models/auth.models';
import { SUPPLIER_NAV } from '../supplier.nav';

@Component({
  selector: 'app-supplier-analytics',
  standalone: true,
  imports: [CommonModule, LayoutComponent],
  templateUrl: './supplier-analytics.component.html',
  styleUrls: ['./supplier-analytics.component.css']
})
export class SupplierAnalyticsComponent implements OnInit {
  nav = SUPPLIER_NAV;
  summary: any = { totalOrders: 0, totalRevenue: 0, topProduct: '—', avgRating: 0.0 };
  inventoryByStatus = { active: 0, inactive: 0 };
  loading = true;
  monthlyGrowthTrend: any[] = [];

  constructor(private svc: SupplierService) {}

  ngOnInit() {
    this.svc.getAnalytics().subscribe({
      next: r => {
        this.loading = false;
        if (r.success && r.data) {
          this.summary = r.data;
          if (r.data.monthlySalesTrend) {
            this.monthlyGrowthTrend = r.data.monthlySalesTrend;
          }
        }
      },
      error: () => { this.loading = false; }
    });
    
    this.svc.getInventory().subscribe({
      next: r => {
        if (r.success) {
          this.inventoryByStatus.active   = r.data.filter(i => i.isActive).length;
          this.inventoryByStatus.inactive = r.data.filter(i => !i.isActive).length;
        }
      }
    });
  }

  get totalInv() {
    return this.inventoryByStatus.active + this.inventoryByStatus.inactive || 1;
  }

  get maxSalesVal() {
    return Math.max(...this.monthlyGrowthTrend.map(t => t.sales)) || 1;
  }

  barHeight(sales: number) {
    return Math.round((sales / this.maxSalesVal) * 100);
  }
}
