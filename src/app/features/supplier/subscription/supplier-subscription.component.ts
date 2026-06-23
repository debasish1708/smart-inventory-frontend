import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from '../../../shared/components/layout/layout.component';
import { SupplierService } from '../../../core/services/supplier.service';
import { SUPPLIER_NAV } from '../supplier.nav';

@Component({ selector:'app-supplier-subscription', standalone:true, imports:[CommonModule,LayoutComponent],
  templateUrl:'./supplier-subscription.component.html', styleUrls:['./supplier-subscription.component.css'] })
export class SupplierSubscriptionComponent implements OnInit {
  nav = SUPPLIER_NAV; current: any = null; loading = true;
  plans = [
    { name:'FREE',    price:0,    color:'#607d8b', features:['Up to 20 product listings','Basic analytics','Email support'] },
    { name:'BASIC',   price:799,  color:'#6a1b9a', features:['Up to 200 listings','Advanced analytics','Priority support','Order management'] },
    { name:'PREMIUM', price:1999, color:'#1b5e20', features:['Unlimited listings','Full AI-powered matching','Dedicated manager','Custom reports','API access'] },
  ];
  constructor(private svc: SupplierService) {}
  ngOnInit() { this.svc.getSubscription().subscribe({ next:r=>{ this.loading=false; if(r.success) this.current=r.data; }, error:()=>this.loading=false }); }
  isActive(n:string) { return this.current?.planName===n; }
}
