import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from '../../../shared/components/layout/layout.component';
import { SupplierService } from '../../../core/services/supplier.service';
import { Order } from '../../../core/models/auth.models';
import { SUPPLIER_NAV } from '../supplier.nav';

@Component({ selector: 'app-supplier-report', standalone: true,
  imports: [CommonModule, LayoutComponent],
  templateUrl: './supplier-report.component.html',
  styleUrls: ['./supplier-report.component.css'] })
export class SupplierReportComponent implements OnInit {
  nav = SUPPLIER_NAV;
  orders: Order[] = [];
  loading = true;
  error = '';

  get totalRevenue() {
    return this.orders.reduce((s, o) => s + (o.totalAmount ?? 0), 0);
  }
  get totalItems() {
    return this.orders.reduce((s, o) => s + (o.items?.length ?? 0), 0);
  }

  constructor(private svc: SupplierService) {}
  ngOnInit() {
    this.svc.getReport().subscribe({
      next: r => { this.loading = false; if (r.success) this.orders = r.data ?? []; },
      error: () => { this.loading = false; }
    });
  }
}
