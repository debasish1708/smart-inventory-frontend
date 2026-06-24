import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({ selector:'app-verify-otp', standalone:true, imports:[CommonModule,RouterLink],
  templateUrl:'./verify-otp.component.html', styleUrls:['./verify-otp.component.css'] })
export class VerifyOtpComponent implements OnInit, AfterViewInit {
  @ViewChild('otpContainer') otpContainer!: ElementRef<HTMLDivElement>;
  email=''; loading=false; error=''; success=''; timer=60;
  private timerRef: any; private inputs: HTMLInputElement[]=[];

  constructor(private auth:AuthService, private router:Router, private route:ActivatedRoute) {}
  ngOnInit()       { this.email=this.route.snapshot.queryParamMap.get('email')||''; this.startTimer(); }
  ngAfterViewInit(){ this.buildInputs(); }

  private buildInputs() {
    const c=this.otpContainer.nativeElement; c.innerHTML=''; this.inputs=[];
    for(let i=0;i<6;i++){
      const inp=document.createElement('input');
      inp.type='text'; inp.inputMode='numeric'; inp.maxLength=1; inp.autocomplete='off';
      inp.style.cssText='width:48px;height:52px;text-align:center;font-size:22px;font-weight:700;border:2px solid #d0d5dd;border-radius:8px;outline:none;margin:0 4px;font-family:monospace;transition:border-color .2s,box-shadow .2s;';
      inp.addEventListener('focus',()=>{ inp.style.borderColor='#1565c0'; inp.style.boxShadow='0 0 0 3px rgba(21,101,192,0.15)'; inp.select(); });
      inp.addEventListener('blur', ()=>{ inp.style.borderColor=inp.value?'#1565c0':'#d0d5dd'; inp.style.boxShadow='none'; });
      inp.addEventListener('keydown',(e)=>this.handleKey(e,i));
      inp.addEventListener('paste',(e)=>this.handlePaste(e));
      c.appendChild(inp); this.inputs.push(inp);
    }
    setTimeout(()=>this.inputs[0]?.focus(),100);
  }

  private handleKey(e:KeyboardEvent,idx:number){
    if(['Tab','ArrowLeft','ArrowRight'].includes(e.key)) return;
    if(e.key==='Backspace'){ e.preventDefault(); if(this.inputs[idx].value) this.inputs[idx].value=''; else if(idx>0){ this.inputs[idx-1].value=''; this.inputs[idx-1].focus(); } return; }
    if(!/^\d$/.test(e.key)){ e.preventDefault(); return; }
    e.preventDefault(); this.inputs[idx].value=e.key; if(idx<5) this.inputs[idx+1].focus();
  }

  private handlePaste(e:ClipboardEvent){
    e.preventDefault();
    const t=(e.clipboardData?.getData('text')??'').replace(/\D/g,'').slice(0,6);
    t.split('').forEach((c,i)=>{ if(this.inputs[i]) this.inputs[i].value=c; });
    const n=this.inputs.findIndex(i=>!i.value); this.inputs[n===-1?5:n]?.focus();
  }

  private getOtp(){ return this.inputs.map(i=>i.value).join(''); }

  startTimer(){ this.timer=60; clearInterval(this.timerRef); this.timerRef=setInterval(()=>{ if(this.timer>0) this.timer--; else clearInterval(this.timerRef); },1000); }

  resend(e:Event){ e.preventDefault(); if(!this.email) return; this.error=''; this.success=''; this.inputs.forEach(i=>i.value=''); this.inputs[0]?.focus();
    this.auth.resendOtp(this.email).subscribe({ next:r=>{ this.success=r.message||'OTP resent!'; this.startTimer(); }, error:err=>this.error=err.error?.message||'Could not resend.' }); }

  verify(){ this.error=''; const otp=this.getOtp(); if(otp.length<6){ this.error='Please enter all 6 digits.'; return; } this.loading=true;
    this.auth.verifyOtp({email:this.email,otp}).subscribe({
      next:r=>{ this.loading=false; if(r.success){ this.success='Email verified! Redirecting…'; setTimeout(()=>this.router.navigate(['/']),1500); } else this.error=r.message; },
      error:err=>{ this.loading=false; this.error=err.error?.message||'Verification failed.'; }
    }); }
}
