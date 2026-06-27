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
  subscription: any = null;
  hasActiveSubscription = false;

  constructor(private svc: SupplierService, private auth: AuthService) {}
  get userName()         { return this.auth.getCurrentUser()?.email?.split('@')[0]??'Supplier'; }
  get userStatus()       { return this.auth.getCurrentUser()?.status??''; }
  get profileCompleted() { return this.auth.getCurrentUser()?.profileCompleted??false; }

  ngOnInit() {
    this.checkSubscription();
  }

  checkSubscription() {
    this.loading = true;
    this.svc.getSubscription().subscribe({
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
    this.svc.getInventory().subscribe({ next:r=>{ this.loading=false; if(r.success) this.stats.inventory=r.data.length; }, error:()=>this.loading=false });
    this.svc.getOrders().subscribe({ next:r=>{ if(r.success){ this.recentOrders=r.data.slice(0,5); this.stats.orders=r.data.length; this.stats.pendingOrders=r.data.filter((o:any)=>o.status==='PENDING').length; }}});
    this.svc.getRatings().subscribe({ next:r=>{ if(r.success&&r.data.length) this.stats.avgRating=+(r.data.reduce((s:number,x:any)=>s+x.rating,0)/r.data.length).toFixed(1); }});
  }

  getPlanColor(name: string): string {
    if (name === 'FREE') return '#64748b';
    if (name === 'BASIC') return '#7c3aed';
    if (name === 'PREMIUM') return '#10b981';
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
}
