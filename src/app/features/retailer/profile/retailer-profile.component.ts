import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LayoutComponent } from '../../../shared/components/layout/layout.component';
import { ProfileService, UpdateProfileRequest } from '../../../core/services/profile.service';
import { AuthService } from '../../../core/services/auth.service';
import { RETAILER_NAV } from '../retailer.nav';

@Component({ selector:'app-retailer-profile', standalone:true,
  imports:[CommonModule,FormsModule,LayoutComponent],
  templateUrl:'./retailer-profile.component.html',
  styleUrls:['./retailer-profile.component.css'] })
export class RetailerProfileComponent implements OnInit {
  nav = RETAILER_NAV;
  profile: any = null;
  form: UpdateProfileRequest = { firstName:'',lastName:'',businessName:'',businessType:'',mobNo:'',address:'',gst:'',city:'',state:'',pincode:'' };
  loading = true; saving = false; error = ''; success = '';

  constructor(private profileSvc: ProfileService, private auth: AuthService) {}
  get initials() {
    if(this.profile?.firstName) return (this.profile.firstName[0]+(this.profile.lastName?.[0]??'')).toUpperCase();
    return this.profile?.email?.slice(0,2).toUpperCase()??'';
  }
  ngOnInit() {
    this.profileSvc.getMyProfile().subscribe({
      next: r => { this.loading=false; if(r.success){ this.profile=r.data; this.form={firstName:r.data.firstName??'',lastName:r.data.lastName??'',businessName:r.data.businessName??'',businessType:r.data.businessType??'',mobNo:r.data.mobNo??'',address:r.data.address??'',gst:r.data.gst??'',city:r.data.city??'',state:r.data.state??'',pincode:r.data.pincode??''}; }},
      error: ()=>this.loading=false
    });
  }
  save() {
    this.saving=true; this.error=''; this.success='';
    const method = this.profile?.profileCompleted ? this.profileSvc.updateProfile(this.form) : this.profileSvc.completeProfile(this.form);
    method.subscribe({
      next:r=>{ this.saving=false; if(r.success){ this.success='Profile saved!'; this.profile=r.data; this.auth.updateUserCache({profileCompleted:true}); } else this.error=r.message; },
      error:err=>{ this.saving=false; this.error=err.error?.message||'Failed'; }
    });
  }
}
