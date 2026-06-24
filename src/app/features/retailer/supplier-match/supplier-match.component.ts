import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LayoutComponent } from '../../../shared/components/layout/layout.component';
import { RetailerService } from '../../../core/services/retailer.service';
import { RETAILER_NAV } from '../retailer.nav';

@Component({
  selector: 'app-supplier-match',
  standalone: true,
  imports: [CommonModule, FormsModule, LayoutComponent],
  templateUrl: './supplier-match.component.html',
  styleUrls: ['./supplier-match.component.css']
})
export class SupplierMatchComponent implements OnInit {
  nav = RETAILER_NAV;
  matches: any[] = [];
  filtered: any[] = [];
  searchProduct = '';
  loading = false;
  error = '';
  sortBy = 'smart'; // Default sorting is smart recommendation!

  bestMatch: any = null; // Highlighting the top suggested supplier

  constructor(private svc: RetailerService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['search']) {
        this.searchProduct = params['search'];
      }
      this.loadAll();
    });
  }

  loadAll() {
    this.loading = true;
    this.svc.getAllSupplierMatches().subscribe({
      next: r => {
        this.loading = false;
        if (r.success) {
          this.matches = r.data;
          this.apply();
        }
      },
      error: () => {
        this.loading = false;
        this.matches = this.getMockData();
        this.apply();
      }
    });
  }

  search() {
    if (!this.searchProduct.trim()) {
      this.apply();
      return;
    }
    this.loading = true;
    this.svc.getSupplierMatches(this.searchProduct).subscribe({
      next: r => {
        this.loading = false;
        if (r.success) {
          this.matches = r.data;
          this.apply();
        }
      },
      error: () => {
        this.loading = false;
        // Search filter mock data locally
        this.apply();
      }
    });
  }

  apply() {
    let data = this.searchProduct
      ? this.matches.filter(m => m.productName?.toLowerCase().includes(this.searchProduct.toLowerCase()))
      : [...this.matches];

    // Compute availability date and smart score for all filtered items
    data.forEach(item => {
      item.minOrderCost = item.price * item.moq;
      item.availabilityDate = this.getAvailabilityDate(item.leadTime);
      item.recommendationScore = this.calculateRecommendationScore(item, data);
    });

    // Sorting
    if (this.sortBy === 'smart') {
      data.sort((a, b) => b.recommendationScore - a.recommendationScore);
    } else if (this.sortBy === 'price') {
      data.sort((a, b) => a.price - b.price);
    } else if (this.sortBy === 'rating') {
      data.sort((a, b) => b.rating - a.rating);
    } else if (this.sortBy === 'stock') {
      data.sort((a, b) => b.stockQuantity - a.stockQuantity);
    }

    this.filtered = data;

    // Set the best matching supplier
    if (this.filtered.length > 0) {
      this.bestMatch = this.filtered[0];
    } else {
      this.bestMatch = null;
    }
  }

  getAvailabilityDate(leadTime: number): Date {
    const d = new Date();
    d.setDate(d.getDate() + (leadTime || 1));
    return d;
  }

  calculateRecommendationScore(item: any, allItems: any[]): number {
    if (allItems.length <= 1) return 100;

    const costs = allItems.map(x => x.price * x.moq);
    const ratings = allItems.map(x => x.rating || 0);
    const leadTimes = allItems.map(x => x.leadTime || 1);

    const minCost = Math.min(...costs);
    const maxCost = Math.max(...costs);
    const minLead = Math.min(...leadTimes);
    const maxLead = Math.max(...leadTimes);
    const minRating = Math.min(...ratings);
    const maxRating = Math.max(...ratings);

    // 1. Cost factor (lower is better)
    const costRange = maxCost - minCost || 1;
    const itemCost = item.price * item.moq;
    const costFactor = 1 - (itemCost - minCost) / costRange; // 0 to 1

    // 2. Rating factor (higher is better)
    const ratingRange = maxRating - minRating || 1;
    const ratingFactor = ((item.rating || 0) - minRating) / ratingRange; // 0 to 1

    // 3. Lead Time / Availability factor (lower leadTime is better)
    const leadRange = maxLead - minLead || 1;
    const leadFactor = 1 - ((item.leadTime || 1) - minLead) / leadRange; // 0 to 1

    // Combine with weights: 40% Min Order Cost (Price * MOQ), 30% Rating, 30% Availability
    const score = (costFactor * 0.4 + ratingFactor * 0.3 + leadFactor * 0.3) * 100;
    return Math.round(score);
  }

  stars(r: number) {
    return '★'.repeat(Math.round(r)) + '☆'.repeat(5 - Math.round(r));
  }

  getMockData() {
    return [
      { supplierId: 1, supplierName: 'Ravi Traders', businessName: 'Ravi Suppliers Pvt Ltd', productName: 'Basmati Rice', price: 52, moq: 50, stockQuantity: 500, rating: 4.5, leadTime: 2 },
      { supplierId: 2, supplierName: 'Sharma Bros', businessName: 'Sharma Brothers', productName: 'Basmati Rice', price: 48, moq: 100, stockQuantity: 1200, rating: 4.2, leadTime: 3 },
      { supplierId: 4, supplierName: 'Balaji Foodgrains', businessName: 'Balaji Wholesale Ltd', productName: 'Basmati Rice', price: 55, moq: 30, stockQuantity: 400, rating: 4.7, leadTime: 1 },
      { supplierId: 3, supplierName: 'Green Farms', businessName: 'Green Farms Co.', productName: 'Wheat Flour', price: 30, moq: 25, stockQuantity: 800, rating: 4.8, leadTime: 1 },
      { supplierId: 5, supplierName: 'Apex Organics', businessName: 'Apex Organic Foods', productName: 'Wheat Flour', price: 35, moq: 10, stockQuantity: 600, rating: 4.4, leadTime: 2 },
    ];
  }
}
