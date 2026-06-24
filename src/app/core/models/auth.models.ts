export interface LoginRequest    { email: string; password: string; }
export interface RegisterRequest { email: string; password: string; role: string; }
export interface VerifyOtpRequest{ email: string; otp: string; }

export interface AuthResponse {
  token: string; email: string; role: string;
  status: string; userId: number; profileCompleted: boolean;
}
export interface ApiResponse<T> { success: boolean; message: string; data: T; }

export interface ProfileResponse {
  userId: number; email: string; role: string; userStatus: string; profileCompleted: boolean;
  firstName?: string; lastName?: string; businessName?: string; businessType?: string;
  mobNo?: string; address?: string; gst?: string; city?: string;
  state?: string; pincode?: string; profileImageUrl?: string;
}

export interface AdminUser {
  id: number; email: string; role: string; status: string;
  profileStatus: string; createdAt: string;
}
export interface AdminStats { total: number; pending: number; active: number; blocked: number; }

// Inventory – same shape for retailer and supplier (supplier-only fields are optional)
export interface InventoryItem {
  id: number;
  productName: string;
  category: string;
  brand?: string;
  unit?: string;
  sku?: string;
  price: number;
  // retailer
  quantity?: number;
  thresholdValue?: number;
  // supplier
  moq?: number;
  stockQuantity?: number;
  leadTime?: number;
  isActive?: boolean;
}

export interface OrderItemResponse {
  id: number; productName: string; quantity: number; price: number; unit: string;
}

export interface Order {
  id: number; status: string;
  orderDate: string; deliveredDate?: string;
  supplierEmail?: string; retailerEmail?: string;
  items?: OrderItemResponse[];
  totalAmount?: number;
}

export interface Rating {
  id: number; rating: number; review: string;
  supplierEmail?: string; retailerEmail?: string; createdAt: string;
}

export interface SupplierMatch {
  supplierId: number; supplierName: string; businessName: string;
  productName: string; category: string; price: number;
  moq: number; stockQuantity: number; leadTime: number; rating: number;
}

export interface AnalyticsResponse {
  totalOrders: number; totalRevenue: number;
  topProduct: string; monthlyGrowth: number;
}

export interface SubscriptionResponse {
  id: number; planName: string; status: string;
  startDateTime?: string; endDateTime?: string;
}

export interface CatalogCategory {
  id: number;
  name: string;
  description?: string;
}

export interface CatalogProduct {
  id: number;
  name: string;
  description?: string;
  sku?: string;
  brand?: string;
  unit?: string;
  categoryId?: number;
  categoryName?: string;
}

