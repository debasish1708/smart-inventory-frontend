import { Routes } from '@angular/router';
import { authGuard, adminGuard, retailerGuard, supplierGuard, guestGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./features/portal/portal.component').then(m => m.PortalComponent) },

  // ── Auth ──
  {
    path: 'auth', canActivate: [guestGuard],
    children: [
      { path: 'login',      redirectTo: '/', pathMatch: 'full' },
      { path: 'register',   redirectTo: '/', pathMatch: 'full' },
      { path: 'verify-otp', loadComponent: () => import('./features/auth/verify-otp/verify-otp.component').then(m => m.VerifyOtpComponent) },
      { path: '', redirectTo: 'login', pathMatch: 'full' }
    ]
  },

  // ── Retailer ──
  {
    path: 'retailer', canActivate: [retailerGuard],
    children: [
      { path: 'dashboard',      loadComponent: () => import('./features/retailer/dashboard/retailer-dashboard.component').then(m => m.RetailerDashboardComponent) },
      { path: 'inventory',      loadComponent: () => import('./features/retailer/inventory/retailer-inventory.component').then(m => m.RetailerInventoryComponent) },
      { path: 'orders',         loadComponent: () => import('./features/retailer/orders/retailer-orders.component').then(m => m.RetailerOrdersComponent) },
      { path: 'supplier-match', loadComponent: () => import('./features/retailer/supplier-match/supplier-match.component').then(m => m.SupplierMatchComponent) },
      { path: 'ratings',        loadComponent: () => import('./features/retailer/ratings/retailer-ratings.component').then(m => m.RetailerRatingsComponent) },
      { path: 'analytics',      loadComponent: () => import('./features/retailer/analytics/retailer-analytics.component').then(m => m.RetailerAnalyticsComponent) },
      { path: 'subscription',   loadComponent: () => import('./features/retailer/subscription/retailer-subscription.component').then(m => m.RetailerSubscriptionComponent) },
      { path: 'profile',        loadComponent: () => import('./features/retailer/profile/retailer-profile.component').then(m => m.RetailerProfileComponent) },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  // ── Supplier ──
  {
    path: 'supplier', canActivate: [supplierGuard],
    children: [
      { path: 'dashboard',    loadComponent: () => import('./features/supplier/dashboard/supplier-dashboard.component').then(m => m.SupplierDashboardComponent) },
      { path: 'inventory',    loadComponent: () => import('./features/supplier/inventory/supplier-inventory.component').then(m => m.SupplierInventoryComponent) },
      { path: 'orders',       loadComponent: () => import('./features/supplier/orders/supplier-orders.component').then(m => m.SupplierOrdersComponent) },
      { path: 'ratings',      loadComponent: () => import('./features/supplier/ratings/supplier-ratings.component').then(m => m.SupplierRatingsComponent) },
      { path: 'analytics',    loadComponent: () => import('./features/supplier/analytics/supplier-analytics.component').then(m => m.SupplierAnalyticsComponent) },
      { path: 'report',       loadComponent: () => import('./features/supplier/report/supplier-report.component').then(m => m.SupplierReportComponent) },
      { path: 'subscription', loadComponent: () => import('./features/supplier/subscription/supplier-subscription.component').then(m => m.SupplierSubscriptionComponent) },
      { path: 'profile',      loadComponent: () => import('./features/supplier/profile/supplier-profile.component').then(m => m.SupplierProfileComponent) },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  // ── Admin ──
  {
    path: 'admin', canActivate: [adminGuard],
    children: [
      { path: 'dashboard',    loadComponent: () => import('./features/admin/dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent) },
      { path: 'retailers',    loadComponent: () => import('./features/admin/retailers/admin-retailers.component').then(m => m.AdminRetailersComponent) },
      { path: 'suppliers',    loadComponent: () => import('./features/admin/suppliers/admin-suppliers.component').then(m => m.AdminSuppliersComponent) },
      { path: 'analytics',    loadComponent: () => import('./features/admin/analytics/admin-analytics.component').then(m => m.AdminAnalyticsComponent) },
      { path: 'user-profile/:id', loadComponent: () => import('./features/admin/user-profile-view/user-profile-view.component').then(m => m.UserProfileViewComponent) },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  { path: '**', redirectTo: 'auth/login' }
];
