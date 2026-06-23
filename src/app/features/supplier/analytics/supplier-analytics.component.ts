import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from '../../../shared/components/layout/layout.component';
import { SupplierService } from '../../../core/services/supplier.service';
import { AnalyticsResponse } from '../../../core/models/auth.models';
import { SUPPLIER_NAV } from '../supplier.nav';

@Component({ selector: 'app-supplier-analytics', standalone: true,
  imports: [CommonModule, LayoutComponent],
  templateUrl: './supplier-analytics.component.html',
  styleUrls: ['./supplier-analytics.component.css'] })
export class SupplierAnalyticsComponent implements OnInit {
  nav = SUPPLIER_NAV;
  summary: AnalyticsResponse = { totalOrders: 0, totalRevenue: 0, topProduct: '—', monthlyGrowth: 0 };
  inventoryByStatus = { active: 0, inactive: 0 };
  loading = true;

  constructor(private svc: SupplierService) {}

  ngOnInit() {
    this.svc.getAnalytics().subscribe({
      next: r => { this.loading = false; if (r.success && r.data) this.summary = r.data; },
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
}
