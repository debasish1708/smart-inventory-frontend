import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LayoutComponent } from '../../../shared/components/layout/layout.component';
import { AdminService } from '../../../core/services/admin.service';
import { ADMIN_NAV } from '../admin.nav';

@Component({ selector:'app-admin-dashboard', standalone:true, imports:[CommonModule,RouterLink,LayoutComponent],
  templateUrl:'./admin-dashboard.component.html', styleUrls:['./admin-dashboard.component.css'] })
export class AdminDashboardComponent implements OnInit {
  nav = ADMIN_NAV; stats: any = null; loading = true;

  constructor(private svc: AdminService) {}
  ngOnInit() { this.svc.getStats().subscribe({ next:r=>{ this.loading=false; if(r.success) this.stats=r.data; }, error:()=>this.loading=false }); }
}
