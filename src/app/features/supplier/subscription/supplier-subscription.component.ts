import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LayoutComponent } from '../../../shared/components/layout/layout.component';
import { SupplierService } from '../../../core/services/supplier.service';
import { SUPPLIER_NAV } from '../supplier.nav';

@Component({ selector:'app-supplier-subscription', standalone:true,
  imports:[CommonModule,FormsModule,LayoutComponent],
  templateUrl:'./supplier-subscription.component.html',
  styleUrls:['./supplier-subscription.component.css'] })
export class SupplierSubscriptionComponent implements OnInit {
  nav = SUPPLIER_NAV;
  current: any = null;
  loading = true;
  plans = [
    { name:'FREE',    price:0,    color:'#64748b', features:['Up to 20 product listings','Basic analytics','Email support'] },
    { name:'BASIC',   price:799,  color:'#7c3aed', features:['Up to 200 listings','Advanced analytics','Priority support','Order management'] },
    { name:'PREMIUM', price:1999, color:'#10b981', features:['Unlimited listings','Full AI-powered matching','Dedicated manager','Custom reports','API access'] },
  ];
  upgradeLoading = false;
  upgradeSuccess = false;
  selectedPlanName = '';

  // Payment simulation state
  showPaymentModal = false;
  paymentMethod: 'card' | 'upi' = 'card';
  cardForm = { number: '', expiry: '', cvv: '', name: '' };
  upiId = '';
  submittingPayment = false;
  paymentError = '';

  constructor(private svc: SupplierService) {}
  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    this.svc.getSubscription().subscribe({
      next: r => { this.loading = false; if (r.success) this.current = r.data; },
      error: () => this.loading = false
    });
  }

  isActive(name:string) { return this.current?.planName === name; }

  isUnexpired(name:string): boolean {
    return !!(this.current?.unexpiredPlans && this.current.unexpiredPlans.includes(name));
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

  upgrade(planName: string) {
    const plan = this.plans.find(p => p.name === planName);
    if (!plan) return;

    // Reactivate for FREE plan OR any already-purchased unexpired plan
    if (plan.price === 0 || this.isUnexpired(planName)) {
      this.selectedPlanName = planName;
      this.upgradeLoading = true;
      this.upgradeSuccess = false;
      this.svc.upgradeSubscription(planName).subscribe({
        next: r => {
          this.upgradeLoading = false;
          if (r.success) {
            this.upgradeSuccess = true;
            this.load();
            setTimeout(() => this.upgradeSuccess = false, 3000);
          }
        },
        error: () => {
          this.upgradeLoading = false;
        }
      });
    } else {
      // BASIC or PREMIUM (not purchased yet): open payment simulation modal
      this.openPayment(plan);
    }
  }

  openPayment(plan: any) {
    this.selectedPlanName = plan.name;
    this.paymentError = '';
    this.cardForm = { number: '', expiry: '', cvv: '', name: '' };
    this.upiId = '';
    this.paymentMethod = 'card';
    this.showPaymentModal = true;
  }

  closePayment() {
    this.showPaymentModal = false;
    this.selectedPlanName = '';
  }

  onCardNumberInput(event: any) {
    let value = event.target.value.replace(/\D/g, ''); // Keep only digits
    let formatted = '';
    for (let i = 0; i < value.length && i < 16; i++) {
      if (i > 0 && i % 4 === 0) {
        formatted += ' ';
      }
      formatted += value[i];
    }
    this.cardForm.number = formatted;
    event.target.value = formatted;
  }

  onCardExpiryInput(event: any) {
    let value = event.target.value.replace(/\D/g, ''); // Keep only digits
    let formatted = '';
    if (value.length > 0) {
      formatted += value.substring(0, 2);
      if (value.length > 2) {
        formatted += '/' + value.substring(2, 4);
      }
    }
    this.cardForm.expiry = formatted;
    event.target.value = formatted;
  }

  submitPayment() {
    if (this.paymentMethod === 'card') {
      if (!this.cardForm.number || !this.cardForm.expiry || !this.cardForm.cvv || !this.cardForm.name) {
        this.paymentError = 'Please fill in all card details.';
        return;
      }
      const rawCardNumber = this.cardForm.number.replace(/\s+/g, '');
      if (rawCardNumber.length !== 16) {
        this.paymentError = 'Card number must be exactly 16 digits.';
        return;
      }
      
      const expiryRegex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
      const match = this.cardForm.expiry.match(expiryRegex);
      if (!match) {
        this.paymentError = 'Expiry date must be in MM/YY format (e.g. 12/29).';
        return;
      }
      const month = parseInt(match[1], 10);
      const year = parseInt(match[2], 10);
      const now = new Date();
      const currentYear = now.getFullYear() % 100;
      const currentMonth = now.getMonth() + 1;
      if (year < currentYear || (year === currentYear && month < currentMonth)) {
        this.paymentError = 'Card expiry date has expired.';
        return;
      }

      if (!/^[0-9]{3}$/.test(this.cardForm.cvv)) {
        this.paymentError = 'CVV must be exactly 3 digits.';
        return;
      }
    } else {
      if (!this.upiId || !this.upiId.includes('@')) {
        this.paymentError = 'Please enter a valid UPI ID (e.g. name@upi).';
        return;
      }
    }

    this.submittingPayment = true;
    this.paymentError = '';
    this.upgradeSuccess = false;

    this.svc.upgradeSubscription(this.selectedPlanName).subscribe({
      next: r => {
        this.submittingPayment = false;
        if (r.success) {
          this.upgradeSuccess = true;
          this.showPaymentModal = false;
          this.load();
          setTimeout(() => this.upgradeSuccess = false, 3000);
        } else {
          this.paymentError = r.message || 'Payment simulation failed.';
        }
      },
      error: err => {
        this.submittingPayment = false;
        this.paymentError = err.error?.message || 'Payment failed. Please try again.';
      }
    });
  }

  getSelectedPlanPrice(): number {
    const plan = this.plans.find(p => p.name === this.selectedPlanName);
    return plan ? plan.price : 0;
  }
}
