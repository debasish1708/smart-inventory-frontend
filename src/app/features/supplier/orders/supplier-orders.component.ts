import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LayoutComponent } from '../../../shared/components/layout/layout.component';
import { SupplierService } from '../../../core/services/supplier.service';
import { SUPPLIER_NAV } from '../supplier.nav';

@Component({ selector:'app-supplier-orders', standalone:true,
  imports:[CommonModule,FormsModule,LayoutComponent],
  templateUrl:'./supplier-orders.component.html',
  styleUrls:['./supplier-orders.component.css'] })
export class SupplierOrdersComponent implements OnInit {
  nav = SUPPLIER_NAV;
  orders: any[] = []; filtered: any[] = [];
  filterStatus = ''; loading = true; toast = ''; toastType = 'success';

  constructor(private svc: SupplierService) {}
  ngOnInit() { this.load(); }
  load() { this.svc.getOrders().subscribe({ next:r=>{ this.loading=false; if(r.success){ this.orders=r.data; this.apply(); } }, error:()=>this.loading=false }); }
  apply() { this.filtered=this.filterStatus?this.orders.filter(o=>o.status===this.filterStatus):[...this.orders]; }

  updateStatus(o: any, status: string) {
    this.svc.updateOrderStatus(o.id, status).subscribe({
      next: r => { if(r.success){ this.showToast('Order updated to '+status); this.load(); } },
      error: err => this.showToast(err.error?.message||'Failed','error')
    });
  }
  showToast(msg:string, type='success') { this.toast=msg; this.toastType=type; setTimeout(()=>this.toast='',3000); }
  nextStatuses(status: string): string[] {
    const map: Record<string,string[]> = { PENDING:['ACCEPTED','CANCELLED'], ACCEPTED:['DISPATCHED','CANCELLED'], DISPATCHED:['DELIVERED'] };
    return map[status]??[];
  }
}
