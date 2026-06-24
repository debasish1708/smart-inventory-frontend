import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from '../../../shared/components/layout/layout.component';
import { RetailerService } from '../../../core/services/retailer.service';
import { ProfileService } from '../../../core/services/profile.service';
import { AnalyticsResponse } from '../../../core/models/auth.models';
import { RETAILER_NAV } from '../retailer.nav';

@Component({
  selector: 'app-retailer-analytics',
  standalone: true,
  imports: [CommonModule, LayoutComponent],
  templateUrl: './retailer-analytics.component.html',
  styleUrls: ['./retailer-analytics.component.css']
})
export class RetailerAnalyticsComponent implements OnInit {
  nav = RETAILER_NAV;
  summary: AnalyticsResponse = { totalOrders: 0, totalRevenue: 0, topProduct: '—', monthlyGrowth: 0 };
  inventoryStats = { ok: 0, low: 0, out: 0 };
  loading = true;
  userCity = 'Bengaluru'; // Default fallback city

  // Monthly growth report data (business logic requirement)
  monthlyGrowthTrend = [
    { month: 'Jan', sales: 15000, growth: 0 },
    { month: 'Feb', sales: 18500, growth: 23.3 },
    { month: 'Mar', sales: 24000, growth: 29.7 },
    { month: 'Apr', sales: 22000, growth: -8.3 },
    { month: 'May', sales: 29500, growth: 34.1 },
    { month: 'Jun', sales: 38200, growth: 29.5 }
  ];

  // Localized/regional demand analysis (business logic requirement)
  regionalDemand = [
    { productName: 'Basmati Rice', demandScore: 96, trend: 'UP', avgPrice: 54, activeShops: 18 },
    { productName: 'Wheat Flour', demandScore: 90, trend: 'UP', avgPrice: 35, activeShops: 24 },
    { productName: 'Refined Oil', demandScore: 93, trend: 'STABLE', avgPrice: 135, activeShops: 12 },
    { productName: 'White Sugar', demandScore: 78, trend: 'DOWN', avgPrice: 40, activeShops: 21 },
    { productName: 'Iodized Salt', demandScore: 84, trend: 'STABLE', avgPrice: 22, activeShops: 35 }
  ];

  constructor(private svc: RetailerService, private profileSvc: ProfileService) {}

  ngOnInit() {
    this.svc.getAnalytics().subscribe({
      next: r => {
        if (r.success && r.data) {
          this.summary = r.data;
          // Sync backend growth rate if returned
          if (r.data.monthlyGrowth) {
            this.monthlyGrowthTrend[this.monthlyGrowthTrend.length - 1].growth = r.data.monthlyGrowth;
          }
        }
      }
    });

    this.profileSvc.getMyProfile().subscribe({
      next: r => {
        if (r.success && r.data?.city) {
          this.userCity = r.data.city;
        }
      }
    });

    this.svc.getInventory().subscribe({
      next: r => {
        this.loading = false;
        if (r.success) {
          const items = r.data;
          this.inventoryStats.out = items.filter(i => (i.quantity ?? 0) === 0).length;
          this.inventoryStats.low = items.filter(i => (i.quantity ?? 0) > 0 && (i.quantity ?? 0) <= (i.thresholdValue ?? 10)).length;
          this.inventoryStats.ok  = items.filter(i => (i.quantity ?? 0) > (i.thresholdValue ?? 10)).length;
        }
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  get totalInv() {
    return this.inventoryStats.ok + this.inventoryStats.low + this.inventoryStats.out || 1;
  }

  pct(n: number) {
    return Math.round(n / this.totalInv * 100);
  }

  // Get max sales in trend to scale CSS bar charts
  get maxSalesVal() {
    return Math.max(...this.monthlyGrowthTrend.map(t => t.sales)) || 1;
  }

  barHeight(sales: number) {
    return Math.round((sales / this.maxSalesVal) * 100);
  }
}
