import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LayoutComponent } from '../../../shared/components/layout/layout.component';
import { SupplierService } from '../../../core/services/supplier.service';
import { AuthService } from '../../../core/services/auth.service';
import { SUPPLIER_NAV } from '../supplier.nav';

@Component({ selector:'app-supplier-dashboard', standalone:true,
  imports:[CommonModule,RouterLink,LayoutComponent],
  templateUrl:'./supplier-dashboard.component.html',
  styleUrls:['./supplier-dashboard.component.css'] })
export class SupplierDashboardComponent implements OnInit {
  nav = SUPPLIER_NAV;
  stats = { inventory:0, orders:0, pendingOrders:0, avgRating:0 };
  recentOrders: any[] = [];
  loading = true;

  constructor(private svc: SupplierService, private auth: AuthService) {}
  get userName()         { return this.auth.getCurrentUser()?.email?.split('@')[0]??'Supplier'; }
  get userStatus()       { return this.auth.getCurrentUser()?.status??''; }
  get profileCompleted() { return this.auth.getCurrentUser()?.profileCompleted??false; }

  ngOnInit() {
    this.svc.getInventory().subscribe({ next:r=>{ this.loading=false; if(r.success) this.stats.inventory=r.data.length; }, error:()=>this.loading=false });
    this.svc.getOrders().subscribe({ next:r=>{ if(r.success){ this.recentOrders=r.data.slice(0,5); this.stats.orders=r.data.length; this.stats.pendingOrders=r.data.filter((o:any)=>o.status==='PENDING').length; }}});
    this.svc.getRatings().subscribe({ next:r=>{ if(r.success&&r.data.length) this.stats.avgRating=+(r.data.reduce((s:number,x:any)=>s+x.rating,0)/r.data.length).toFixed(1); }});
  }
}
