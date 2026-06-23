import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from '../../../shared/components/layout/layout.component';
import { RetailerService } from '../../../core/services/retailer.service';
import { RETAILER_NAV } from '../retailer.nav';

@Component({ selector:'app-retailer-subscription', standalone:true,
  imports:[CommonModule,LayoutComponent],
  templateUrl:'./retailer-subscription.component.html',
  styleUrls:['./retailer-subscription.component.css'] })
export class RetailerSubscriptionComponent implements OnInit {
  nav = RETAILER_NAV;
  current: any = null;
  loading = true;
  plans = [
    { name:'FREE', price:0, features:['Up to 50 inventory items','Basic supplier search','Email support'], color:'#607d8b' },
    { name:'BASIC', price:499, features:['Up to 500 inventory items','Advanced supplier match','Priority support','Order management'], color:'#1565c0' },
    { name:'PREMIUM', price:1499, features:['Unlimited inventory','AI-powered supplier match','Dedicated account manager','Full analytics','API access'], color:'#6a1b9a' },
  ];
  constructor(private svc: RetailerService) {}
  ngOnInit() { this.svc.getSubscription().subscribe({ next:r=>{ this.loading=false; if(r.success) this.current=r.data; }, error:()=>this.loading=false }); }
  isActive(name:string) { return this.current?.planName === name; }
}
