import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
  sortBy = 'price';

  constructor(private svc: RetailerService) {}

  ngOnInit() { this.loadAll(); }

  loadAll() {
    this.loading = true;
    this.svc.getAllSupplierMatches().subscribe({
      next: r => { this.loading = false; if (r.success) { this.matches = r.data; this.apply(); } },
      error: () => { this.loading = false; this.matches = this.getMockData(); this.apply(); }
    });
  }

  search() {
    if (!this.searchProduct.trim()) { this.apply(); return; }
    this.loading = true;
    this.svc.getSupplierMatches(this.searchProduct).subscribe({
      next: r => { this.loading = false; if (r.success) { this.matches = r.data; this.apply(); } },
      error: () => { this.loading = false; }
    });
  }

  apply() {
    let data = this.searchProduct
      ? this.matches.filter(m => m.productName?.toLowerCase().includes(this.searchProduct.toLowerCase()))
      : [...this.matches];
    if (this.sortBy === 'price')  data.sort((a,b) => a.price - b.price);
    if (this.sortBy === 'rating') data.sort((a,b) => b.rating - a.rating);
    if (this.sortBy === 'stock')  data.sort((a,b) => b.stockQuantity - a.stockQuantity);
    this.filtered = data;
  }

  stars(r: number) { return '★'.repeat(Math.round(r)) + '☆'.repeat(5 - Math.round(r)); }

  getMockData() {
    return [
      { supplierId:1, supplierName:'Ravi Traders', businessName:'Ravi Suppliers Pvt Ltd', productName:'Basmati Rice', price:52, moq:50, stockQuantity:500, rating:4.5, leadTime:2 },
      { supplierId:2, supplierName:'Sharma Bros', businessName:'Sharma Brothers', productName:'Basmati Rice', price:48, moq:100, stockQuantity:1200, rating:4.2, leadTime:3 },
      { supplierId:3, supplierName:'Green Farms', businessName:'Green Farms Co.', productName:'Wheat Flour', price:30, moq:25, stockQuantity:800, rating:4.8, leadTime:1 },
    ];
  }
}
