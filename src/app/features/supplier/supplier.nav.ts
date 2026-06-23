import { NavItem } from '../../shared/components/sidebar/sidebar.component';

export const SUPPLIER_NAV: NavItem[] = [
  { label: 'Dashboard',     icon: '🏠', route: '/supplier/dashboard'  },
  { label: 'My Profile',    icon: '👤', route: '/supplier/profile'    },
  { label: 'Inventory',     icon: '🏭', route: '/supplier/inventory'  },
  { label: 'Order Details', icon: '📋', route: '/supplier/orders'     },
  { label: 'My Ratings',    icon: '⭐', route: '/supplier/ratings'    },
  { label: 'Analytics',     icon: '📊', route: '/supplier/analytics'  },
  { label: 'Reports',       icon: '📈', route: '/supplier/report'     },
  { label: 'Subscription',  icon: '💳', route: '/supplier/subscription'},
];
