import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from '../../../shared/components/layout/layout.component';
import { AdminService } from '../../../core/services/admin.service';
import { ADMIN_NAV } from '../admin.nav';

@Component({ selector:'app-admin-analytics', standalone:true, imports:[CommonModule,LayoutComponent],
  templateUrl:'./admin-analytics.component.html', styleUrls:['./admin-analytics.component.css'] })
export class AdminAnalyticsComponent implements OnInit {
  nav = ADMIN_NAV; stats: any = null;
  growthData = [{month:'Jan',users:5},{month:'Feb',users:12},{month:'Mar',users:8},{month:'Apr',users:22},{month:'May',users:18},{month:'Jun',users:31}];
  constructor(private svc:AdminService) {}
  ngOnInit() { this.svc.getStats().subscribe({next:r=>{ if(r.success) this.stats=r.data; }, error:()=>{}  }); }
  get maxU() { return Math.max(...this.growthData.map(d=>d.users)); }
  barH(v:number){ return Math.round(v/this.maxU*100); }
}
