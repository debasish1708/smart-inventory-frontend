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

  viewOrder(o: any) { this.selected = o; }
  closeDetail()     { this.selected = null; }
}
