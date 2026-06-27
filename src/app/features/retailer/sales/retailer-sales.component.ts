import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LayoutComponent } from '../../../shared/components/layout/layout.component';
import { RetailerService } from '../../../core/services/retailer.service';
import { RETAILER_NAV } from '../retailer.nav';

@Component({
  selector: 'app-retailer-sales',
  standalone: true,
  imports: [CommonModule, FormsModule, LayoutComponent],
  templateUrl: './retailer-sales.component.html',
  styleUrls: ['./retailer-sales.component.css']
})
export class RetailerSalesComponent implements OnInit {
  nav = RETAILER_NAV;
  inventory: any[] = [];
  filteredProducts: any[] = [];
  cart: any[] = [];
  searchQuery = '';
  paymentMode = 'CASH';
  loading = true;
  checkoutLoading = false;
  receipt: any = null;

  // Tabs & Sales History state
  activeTab = 'pos'; // 'pos' or 'history'
  salesHistory: any[] = [];
  todaySummary: any = null;
  historyPage = 0;
  historyPageSize = 5;
  historyTotalPages = 0;
  historyTotalElements = 0;
  historyLast = true;
  historyLoading = false;
  loadingMore = false;

  constructor(private retailerSvc: RetailerService) {}

  ngOnInit() {
    this.loadInventory();
    this.loadTodaySummary();
    this.loadSalesHistory(false);
  }

  switchTab(tab: string) {
    this.activeTab = tab;
    if (tab === 'history') {
      this.refreshHistory();
    }
  }

  refreshHistory() {
    this.loadTodaySummary();
    this.loadSalesHistory(false);
  }

  loadTodaySummary() {
    this.retailerSvc.getTodaySalesSummary().subscribe({
      next: r => {
        if (r.success) {
          this.todaySummary = r.data;
        }
      }
    });
  }

  loadSalesHistory(append: boolean = false) {
    if (!append) {
      this.historyPage = 0;
      this.historyLoading = true;
    } else {
      this.loadingMore = true;
    }

    this.retailerSvc.getSales(this.historyPage, this.historyPageSize).subscribe({
      next: r => {
        this.historyLoading = false;
        this.loadingMore = false;
        if (r.success && r.data) {
          const newContent = r.data.content || [];
          if (append) {
            this.salesHistory = [...this.salesHistory, ...newContent];
          } else {
            this.salesHistory = newContent;
          }
          this.historyTotalPages = r.data.totalPages || 0;
          this.historyTotalElements = r.data.totalElements || 0;
          this.historyLast = r.data.last ?? true;
        }
      },
      error: () => {
        this.historyLoading = false;
        this.loadingMore = false;
      }
    });
  }

  loadNextHistoryPage() {
    if (!this.historyLast && !this.loadingMore) {
      this.historyPage++;
      this.loadSalesHistory(true);
    }
  }

  viewReceiptFromHistory(sale: any) {
    this.receipt = sale;
  }

  loadInventory() {
    this.loading = true;
    this.retailerSvc.getInventory().subscribe({
      next: r => {
        this.loading = false;
        if (r.success) {
          this.inventory = r.data;
          this.filterProducts();
        }
      },
      error: () => { this.loading = false; }
    });
  }

  filterProducts() {
    if (!this.searchQuery.trim()) {
      this.filteredProducts = [...this.inventory];
    } else {
      const q = this.searchQuery.toLowerCase().trim();
      this.filteredProducts = this.inventory.filter(i => 
        (i.productName && i.productName.toLowerCase().includes(q)) ||
        (i.brand && i.brand.toLowerCase().includes(q)) ||
        (i.category && i.category.toLowerCase().includes(q)) ||
        (i.sku && i.sku.toLowerCase().includes(q))
      );
    }
  }

  addToCart(item: any) {
    const existing = this.cart.find(c => c.productId === item.productId);
    if (existing) {
      if (existing.qty < item.quantity) {
        existing.qty++;
      }
    } else {
      this.cart.push({
        productId: item.productId,
        productName: item.productName,
        price: item.price,
        unit: item.unit,
        maxStock: item.quantity,
        qty: 1
      });
    }
  }

  isCartLimitReached(item: any): boolean {
    const existing = this.cart.find(c => c.productId === item.productId);
    return existing ? existing.qty >= item.quantity : false;
  }

  decreaseQty(item: any) {
    if (item.qty > 1) {
      item.qty--;
    } else {
      this.removeFromCart(item);
    }
  }

  increaseQty(item: any) {
    if (item.qty < item.maxStock) {
      item.qty++;
    }
  }

  removeFromCart(item: any) {
    this.cart = this.cart.filter(c => c.productId !== item.productId);
  }

  getCartTotal() {
    return this.cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  }

  checkout() {
    if (this.cart.length === 0) return;

    this.checkoutLoading = true;
    const body = {
      items: this.cart.map(c => ({
        productId: c.productId,
        quantity: c.qty
      }))
    };

    this.retailerSvc.submitSale(body).subscribe({
      next: r => {
        this.checkoutLoading = false;
        if (r.success) {
          this.receipt = r.data;
          this.cart = [];
          this.loadInventory(); // reload to refresh quantities in UI
          this.loadTodaySummary(); // refresh today's summary stats
          this.loadSalesHistory(false); // refresh sales log
        } else {
          alert(r.message || 'Checkout failed');
        }
      },
      error: (err) => {
        this.checkoutLoading = false;
        alert(err.error?.message || 'Checkout failed due to server error');
      }
    });
  }

  closeReceipt() {
    this.receipt = null;
  }

  printReceipt() {
    window.print();
  }
}
