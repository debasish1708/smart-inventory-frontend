import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LayoutComponent } from '../../../shared/components/layout/layout.component';
import { RetailerService } from '../../../core/services/retailer.service';
import { RETAILER_NAV } from '../retailer.nav';

@Component({
  selector: 'app-retailer-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, LayoutComponent],
  templateUrl: './retailer-orders.component.html',
  styleUrls: ['./retailer-orders.component.css']
})
export class RetailerOrdersComponent implements OnInit {
  nav = RETAILER_NAV;
  orders: any[] = [];
  filtered: any[] = [];
  filterStatus = '';
  loading = true;
  selected: any = null;

  showReviewForm = false;
  reviewRating = 5;
  reviewText = '';
  selectedFiles: File[] = [];
  reviewing = false;
  reviewError = '';
  reviewSuccess = '';

  constructor(private svc: RetailerService) {}
  ngOnInit() { this.load(); }

  load() {
    this.svc.getOrders().subscribe({
      next: r => { this.loading = false; if (r.success) { this.orders = r.data; this.apply(); } },
      error: () => { this.loading = false; }
    });
  }

  apply() {
    this.filtered = this.filterStatus
      ? this.orders.filter(o => o.status === this.filterStatus)
      : [...this.orders];
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

    this.svc.submitOrderReview(this.selected.id, this.reviewRating, this.reviewText, this.selectedFiles).subscribe({
      next: r => {
        this.reviewing = false;
        if (r.success) {
          this.reviewSuccess = 'Review submitted successfully!';
          this.selected.reviewed = true;
          this.load();
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
