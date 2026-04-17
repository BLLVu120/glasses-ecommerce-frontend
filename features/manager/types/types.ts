export type ProductStatus = 'ACTIVE' | 'INACTIVE' | 'DRAFT';
export type ProductCategory = 'FRAME' | 'LENS' | 'CONTACT';

export interface ApiResponse<T> {
  code: number;
  message: string;
  result: T;
}

export interface ProductImage {
  id: string;
  imageUrl: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  frameType: string;
  gender: string;
  shape: string;
  frameMaterial: string;
  hingeType: string;
  nosePadType: string;
  weightGram: number;
  minPrice: number;
  maxPrice: number;
  status: 'ACTIVE' | 'INACTIVE';
  orderItemType: string;
  imageUrl: ProductImage[];
  modelUrl?: string;
}

// Interface cho Params filter
export interface ProductQueryParams {
  status?: 'ACTIVE' | 'INACTIVE';
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
  q?: string; // Từ khóa tìm kiếm chung (có thể dùng cho name, brand...) - tùy API hỗ trợ thế nào, bạn có thể thêm các field filter khác nếu API hỗ trợ (ví dụ: name, category...)
  // Bạn có thể thêm các field filter khác nếu API hỗ trợ (ví dụ: name, category...)
}

// Interface cho Response có phân trang
export interface PaginatedResponse<T> {
  code: number;
  message: string;
  result: {
    items: T[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
  };
}

export interface ProductVariant {
  id: string;
  productId: string;
  colorName: string;
  frameFinish: string;
  lensWidthMm: number;
  bridgeWidthMm: number;
  templeLengthMm: number;
  sizeLabel: string;
  price: number;
  quantity: number;
  status: 'ACTIVE' | 'INACTIVE';
  orderItemType: 'IN_STOCK' | 'PRE_ORDER'; // Tùy vào các giá trị API trả về
}

export interface VariantResponse {
  code: number;
  message: string;
  result: {
    items: ProductVariant[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
  };
}
export interface VariantQueryParams {
  productId?: string; // Có thể dùng nếu filter chung, nhưng thường dùng id trên URL
  status?: 'ACTIVE' | 'INACTIVE';
  q?: string; // Từ khóa tìm kiếm chung (có thể dùng cho colorName, frameFinish...) - tùy API hỗ trợ thế nào, bạn có thể thêm các field filter khác nếu API hỗ trợ (ví dụ: colorName, frameFinish...)
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}

export interface DashboardResult {
  revenue: number; // Tổng doanh thu
  revenueGrowth: number; // Tăng trưởng doanh thu (%)
  activeOrders: number; // Đơn hàng đang xử lý
  ordersToday: number; // Đơn hàng trong ngày
  returnPending: number; // Đơn hàng chờ trả hàng
  lowStockItems: number; // Sản phẩm sắp hết hàng
}

// Định nghĩa cấu trúc chuẩn của API Response
export interface DashboardResponse {
  code: number;
  message: string;
  result: DashboardResult;
}
