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
  subscription: any = null;
  hasActiveSubscription = false;

  selected: any = null;
  showReviewForm = false;
  reviewRating = 5;
  reviewText = '';
  selectedFiles: File[] = [];
  reviewing = false;
  reviewError = '';
  reviewSuccess = '';

  constructor(private retailerSvc: RetailerService, private auth: AuthService) {}

  get userName() {
    const u = this.auth.getCurrentUser();
    return u?.email?.split('@')[0] ?? 'Retailer';
  }

  get userStatus() { return this.auth.getCurrentUser()?.status ?? ''; }
  get profileCompleted() { return this.auth.getCurrentUser()?.profileCompleted ?? false; }

  ngOnInit() {
    this.checkSubscription();
  }

  checkSubscription() {
    this.loading = true;
    this.retailerSvc.getSubscription().subscribe({
      next: r => {
        if (r.success && r.data) {
          this.subscription = r.data;
          this.hasActiveSubscription = !!(r.data.status === 'ACTIVE' && r.data.endDateTime && new Date(r.data.endDateTime).getTime() > new Date().getTime());
        } else {
          this.subscription = null;
          this.hasActiveSubscription = false;
        }
        if (this.hasActiveSubscription) {
          this.loadDashboard();
        } else {
          this.loading = false;
        }
      },
      error: () => {
        this.subscription = null;
        this.hasActiveSubscription = false;
        this.loading = false;
      }
    });
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

  getPlanColor(name: string): string {
    if (name === 'FREE') return '#64748b';
    if (name === 'BASIC') return '#2563eb';
    if (name === 'PREMIUM') return '#7c3aed';
    return '#64748b';
  }

  isExpiringSoon(dateStr: string): boolean {
    if (!dateStr) return false;
    const diff = new Date(dateStr).getTime() - new Date().getTime();
    const days = diff / (1000 * 60 * 60 * 24);
    return days > 0 && days <= 7;
  }

  getDaysRemainingText(dateStr: string): string {
    if (!dateStr) return '';
    const diff = new Date(dateStr).getTime() - new Date().getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    if (days < 0) return 'Expired';
    if (days === 0) return 'Expires today';
    if (days === 1) return 'Expires tomorrow';
    return `${days} days remaining`;
  }

  viewOrder(o: any) {
    this.selected = o;
    this.showReviewForm = false;
    this.reviewRating = 5;
    this.reviewText = '';
    this.selectedFiles = [];
    this.reviewError = '';
    this.reviewSuccess = '';
  }

  closeDetail() {
    this.selected = null;
    this.showReviewForm = false;
  }

  isEligibleForReview(order: any): boolean {
    if (!order) return false;
    if (order.status !== 'DELIVERED' || order.reviewed) return false;
    if (!order.deliveredDate) return false;
    const delivered = new Date(order.deliveredDate).getTime();
    const now = new Date().getTime();
    const diffDays = (now - delivered) / (1000 * 60 * 60 * 24);
    return diffDays >= 0 && diffDays <= 7;
  }

  selectStar(val: number) {
    this.reviewRating = val;
  }

  onFileSelected(event: any) {
    if (event.target.files) {
      this.selectedFiles = Array.from(event.target.files);
    }
  }

  submitReview() {
    if (!this.selected) return;
    this.reviewing = true;
    this.reviewError = '';
    this.reviewSuccess = '';

    this.retailerSvc.submitOrderReview(this.selected.id, this.reviewRating, this.reviewText, this.selectedFiles).subscribe({
      next: r => {
        this.reviewing = false;
        if (r.success) {
          this.reviewSuccess = 'Review submitted successfully!';
          this.selected.reviewed = true;
          this.loadDashboard();
          setTimeout(() => {
            this.closeDetail();
          }, 1500);
        } else {
          this.reviewError = r.message || 'Failed to submit review.';
        }
      },
      error: err => {
        this.reviewing = false;
        this.reviewError = err.error?.message || 'Error occurred while submitting review.';
      }
    });
  }
}
