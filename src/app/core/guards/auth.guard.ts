import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService); const router = inject(Router);
  if (auth.isLoggedIn()) return true;
  router.navigate(['/']); return false;
};

export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService); const router = inject(Router);
  if (auth.isLoggedIn() && auth.getRole() === 'ADMIN') return true;
  router.navigate(['/']); return false;
};

export const retailerGuard: CanActivateFn = () => {
  const auth = inject(AuthService); const router = inject(Router);
  if (auth.isLoggedIn() && auth.getRole() === 'RETAILER') return true;
  router.navigate(['/']); return false;
};

export const supplierGuard: CanActivateFn = () => {
  const auth = inject(AuthService); const router = inject(Router);
  if (auth.isLoggedIn() && auth.getRole() === 'SUPPLIER') return true;
  router.navigate(['/']); return false;
};

export const guestGuard: CanActivateFn = () => {
  const auth = inject(AuthService); const router = inject(Router);
  if (!auth.isLoggedIn()) return true;
  const role = auth.getRole();
  if (role === 'ADMIN')    router.navigate(['/admin/dashboard']);
  else if (role === 'RETAILER') router.navigate(['/retailer/dashboard']);
  else if (role === 'SUPPLIER') router.navigate(['/supplier/dashboard']);
  return false;
};
