import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LayoutComponent } from '../../../shared/components/layout/layout.component';
import { RetailerService } from '../../../core/services/retailer.service';
import { AuthService } from '../../../core/services/auth.service';
import { RETAILER_NAV } from '../retailer.nav';

@Component({
  selector: 'app-retailer-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, LayoutComponent],
  templateUrl: './retailer-dashboard.component.html',
  styleUrls: ['./retailer-dashboard.component.css']
})
export class RetailerDashboardComponent implements OnInit {
  nav = RETAILER_NAV;
  stats = { inventory: 0, orders: 0, lowStock: 0, pendingOrders: 0 };
  recentOrders: any[] = [];
  notifications: any[] = [];
  lowStockItems: any[] = [];
  loading = true;

  constructor(private retailerSvc: RetailerService, private auth: AuthService) {}

  get userName() {
    const u = this.auth.getCurrentUser();
    return u?.email?.split('@')[0] ?? 'Retailer';
  }

  get userStatus() { return this.auth.getCurrentUser()?.status ?? ''; }
  get profileCompleted() { return this.auth.getCurrentUser()?.profileCompleted ?? false; }

  ngOnInit() {
    this.loadDashboard();
  }

  loadDashboard() {
    this.retailerSvc.getInventory().subscribe({
      next: r => {
        if (r.success) {
          this.stats.inventory = r.data.length;
          this.lowStockItems = r.data.filter((i: any) => i.quantity <= (i.thresholdValue ?? 10));
          this.stats.lowStock = this.lowStockItems.length;
        }
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
    this.retailerSvc.getOrders().subscribe({
      next: r => {
        if (r.success) {
          this.recentOrders = r.data.slice(0, 5);
          this.stats.orders = r.data.length;
          this.stats.pendingOrders = r.data.filter((o: any) => o.status === 'PENDING').length;
        }
      }
    });
    this.retailerSvc.getNotifications().subscribe({
      next: r => { if (r.success) this.notifications = r.data.slice(0, 4); }
    });
  }
}
