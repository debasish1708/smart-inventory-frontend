import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { LayoutComponent } from '../../../shared/components/layout/layout.component';
import { AdminService } from '../../../core/services/admin.service';
import { ProfileService } from '../../../core/services/profile.service';
import { ADMIN_NAV } from '../admin.nav';

@Component({ selector:'app-user-profile-view', standalone:true, imports:[CommonModule,LayoutComponent],
  templateUrl:'./user-profile-view.component.html', styleUrls:['./user-profile-view.component.css'] })
export class UserProfileViewComponent implements OnInit {
  nav = ADMIN_NAV; userId = 0; profile: any = null; loading = true; toast = ''; toastType = 'success';

  constructor(private route:ActivatedRoute, private router:Router, private adminSvc:AdminService, private profileSvc:ProfileService) {}
  
  ngOnInit(){
    this.userId = +this.route.snapshot.paramMap.get('id')!;
    this.profileSvc.getProfileById(this.userId).subscribe({
      next:r=>{ this.loading=false; if(r.success) this.profile=r.data; },
      error:()=>{ this.loading=false; }
    });
  }

  getImgUrl(filename: string): string {
    return this.profileSvc.getProfileImageUrl(this.profile?.role ?? 'retailer', filename);
  }

  approve(){ this.adminSvc.approveUser(this.userId).subscribe({next:()=>{ this.showToast('User approved!'); this.profile.userStatus='ACTIVE'; }}); }
  block()  { this.adminSvc.blockUser(this.userId).subscribe({next:()=>{ this.showToast('User blocked.','warn'); this.profile.userStatus='BLOCKED'; }}); }
  goBack() { this.router.navigate([this.profile?.role==='SUPPLIER'?'/admin/suppliers':'/admin/retailers']); }
  showToast(m:string,t='success'){ this.toast=m; this.toastType=t; setTimeout(()=>this.toast='',3000); }
}
