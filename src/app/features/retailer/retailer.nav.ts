import { NavItem } from '../../shared/components/sidebar/sidebar.component';

export const RETAILER_NAV: NavItem[] = [
  { label: 'Dashboard',       icon: '🏠', route: '/retailer/dashboard' },
  { label: 'My Profile',      icon: '👤', route: '/retailer/profile'   },
  { label: 'Inventory',       icon: '📦', route: '/retailer/inventory' },
  { label: 'Order Details',   icon: '🛒', route: '/retailer/orders'    },
  { label: 'Sales Portal',    icon: '💰', route: '/retailer/sales'     },
  { label: 'Supplier Match',  icon: '🤝', route: '/retailer/supplier-match' },
  { label: 'My Ratings',      icon: '⭐', route: '/retailer/ratings'   },
  { label: 'Analytics',       icon: '📊', route: '/retailer/analytics' },
  { label: 'Subscription',    icon: '💳', route: '/retailer/subscription' },
];
