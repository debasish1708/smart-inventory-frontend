import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

interface StrengthResult { score:number; label:string; color:string; percent:number; }

@Component({ selector:'app-register', standalone:true, imports:[CommonModule,FormsModule,RouterLink],
  templateUrl:'./register.component.html', styleUrls:['./register.component.css'] })
export class RegisterComponent {
  email=''; password=''; confirmPassword=''; role='';
  showPass=false; showConfirm=false; loading=false; submitted=false; error=''; success='';
  strength: StrengthResult = { score:0, label:'Too Weak', color:'#e53935', percent:0 };
  checks = { length:false, upper:false, lower:false, number:false, special:false };

  constructor(private auth:AuthService, private router:Router) {}

  get emailErr(){ if(!this.email) return 'Email is required'; if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) return 'Invalid email format'; return ''; }
  get passErr() { if(!this.password) return 'Password is required'; if(this.password.length<6) return 'Minimum 6 characters'; return ''; }
  get confirmErr(){ if(!this.confirmPassword) return 'Please confirm your password'; if(this.password!==this.confirmPassword) return 'Passwords do not match'; return ''; }

  onPasswordInput() {
    const p=this.password;
    this.checks = { length:p.length>=6, upper:/[A-Z]/.test(p), lower:/[a-z]/.test(p), number:/[0-9]/.test(p), special:/[^A-Za-z0-9]/.test(p) };
    const score=Object.values(this.checks).filter(Boolean).length;
    const map: Record<number,StrengthResult> = {
      0:{score:0,label:'Too Weak',color:'#e53935',percent:5},
      1:{score:1,label:'Weak',color:'#f57c00',percent:25},
      2:{score:2,label:'Fair',color:'#fbc02d',percent:50},
      3:{score:3,label:'Good',color:'#7cb342',percent:75},
      4:{score:4,label:'Strong',color:'#2e7d32',percent:90},
      5:{score:5,label:'Very Strong',color:'#1b5e20',percent:100}
    };
    this.strength=map[score]??map[0];
  }

  register() {
    this.submitted=true; this.error=''; this.success='';
    if(this.emailErr||this.passErr||this.confirmErr||!this.role) return;
    this.loading=true;
    this.auth.register({ email:this.email, password:this.password, role:this.role }).subscribe({
      next:res=>{ this.loading=false; if(res.success){ this.success='OTP sent to your email!'; setTimeout(()=>this.router.navigate(['/auth/verify-otp'],{queryParams:{email:this.email}}),1500); } else this.error=res.message; },
      error:err=>{ this.loading=false; this.error=err.error?.message||'Registration failed.'; }
    });
  }
}
