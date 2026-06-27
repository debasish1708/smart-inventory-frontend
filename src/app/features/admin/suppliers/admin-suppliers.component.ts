import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LayoutComponent } from '../../../shared/components/layout/layout.component';
import { AdminService } from '../../../core/services/admin.service';
import { ProfileService } from '../../../core/services/profile.service';
import { ADMIN_NAV } from '../admin.nav';

@Component({ selector:'app-admin-suppliers', standalone:true, imports:[CommonModule,FormsModule,LayoutComponent],
  templateUrl:'./admin-suppliers.component.html', styleUrls:['./admin-suppliers.component.css'] })
export class AdminSuppliersComponent implements OnInit {
  nav = ADMIN_NAV; all:any[]=[]; filtered:any[]=[]; search=''; filterStatus=''; loading=true; toast=''; toastType='success';

  constructor(private svc:AdminService, private router:Router, private profileSvc:ProfileService) {}
  
  ngOnInit() { this.load(); }
  
  load() {
    this.svc.getAllUsers().subscribe({
      next: r => {
        this.loading = false;
        if (r.success) {
          this.all = r.data.filter((u: any) => u.role === 'SUPPLIER');
          this.apply();
        }
      },
      error: () => this.loading = false
    });
  }

  apply() {
    this.filtered = this.all.filter(u => (!this.search || u.email.toLowerCase().includes(this.search.toLowerCase())) && (!this.filterStatus || u.status === this.filterStatus));
  }

  getImgUrl(filename: string): string {
    return this.profileSvc.getProfileImageUrl('supplier', filename);
  }

  getInitials(email: string): string {
    return email ? email.slice(0, 2).toUpperCase() : 'SU';
  }

  approve(u:any){ this.svc.approveUser(u.id).subscribe({next:()=>{this.showToast('Approved: '+u.email);this.load();}}); }
  block(u:any)  { this.svc.blockUser(u.id).subscribe({next:()=>{this.showToast('Blocked: '+u.email);this.load();}}); }
  unblock(u:any){ this.svc.unblockUser(u.id).subscribe({next:()=>{this.showToast('Unblocked: '+u.email);this.load();}}); }
  viewProfile(u:any){ this.router.navigate(['/admin/user-profile',u.id]); }
  del(u:any){ if(!confirm('Delete '+u.email+'?')) return; this.svc.deleteUser(u.id).subscribe({next:()=>{this.showToast('Deleted');this.load();}}); }
  showToast(m:string,t='success'){ this.toast=m; this.toastType=t; setTimeout(()=>this.toast='',3000); }
}
