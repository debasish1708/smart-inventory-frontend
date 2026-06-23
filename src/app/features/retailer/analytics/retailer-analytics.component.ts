import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from '../../../shared/components/layout/layout.component';
import { RetailerService } from '../../../core/services/retailer.service';
import { AnalyticsResponse } from '../../../core/models/auth.models';
import { RETAILER_NAV } from '../retailer.nav';

@Component({ selector: 'app-retailer-analytics', standalone: true,
  imports: [CommonModule, LayoutComponent],
  templateUrl: './retailer-analytics.component.html',
  styleUrls: ['./retailer-analytics.component.css'] })
export class RetailerAnalyticsComponent implements OnInit {
  nav = RETAILER_NAV;
  summary: AnalyticsResponse = { totalOrders: 0, totalRevenue: 0, topProduct: '—', monthlyGrowth: 0 };
  inventoryStats = { ok: 0, low: 0, out: 0 };
  loading = true;

  constructor(private svc: RetailerService) {}

  ngOnInit() {
    this.svc.getAnalytics().subscribe({
      next: r => { this.loading = false; if (r.success && r.data) this.summary = r.data; },
      error: () => { this.loading = false; }
    });
    this.svc.getInventory().subscribe({
      next: r => {
        if (r.success) {
          const items = r.data;
          this.inventoryStats.out = items.filter(i => (i.quantity ?? 0) === 0).length;
          this.inventoryStats.low = items.filter(i => (i.quantity ?? 0) > 0 && (i.quantity ?? 0) <= (i.thresholdValue ?? 10)).length;
          this.inventoryStats.ok  = items.filter(i => (i.quantity ?? 0) > (i.thresholdValue ?? 10)).length;
        }
      }
    });
  }

  get totalInv() { return this.inventoryStats.ok + this.inventoryStats.low + this.inventoryStats.out || 1; }
  pct(n: number) { return Math.round(n / this.totalInv * 100); }
}
