export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  frameType: string;
  gender: string;
  shape: string;
  frameMaterial: string;
  status: string;
  nosePadType: string;
  hingeType: string;
  // Thêm minPrice, maxPrice theo chuẩn JSON API
  minPrice: number;
  maxPrice: number;

  // Sửa lại kiểu dữ liệu của imageUrl
  imageUrl: ProductImage[];
  weightGram: number;
  modelUrl?: string;
}
export interface ProductImage {
  id: string;
  imageUrl: string;
}

export interface LensProduct {
  id: string;
  name: string;
  material: string;
  price: number;
  description: string;
}
// src/types/product.ts (hoặc variant.ts)

// Type Variant cốt lõi (như mình đã chốt ở trên)
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
  status: string;
  type: string | null;
  orderItemType: string;
}

// Cấu trúc trả về của API getVariants
export interface GetVariantsResponse {
  result: {
    items: ProductVariant[];
    totalElements?: number;
    totalPages?: number;
  };
  message?: string;
  statusCode?: number;
}
export interface FilterParams {
  q?: string;
  gender?: string;
  status?: string;
  page?: number;
  size?: number;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}

// Cấu trúc chung cho Response có phân trang (dùng chung được cho cả Variant và Product)
export interface PaginatedResult<T> {
  items: T[];
  totalElements?: number;
  totalPages?: number;
}
export interface GetFilteredProductsResponse {
  result: PaginatedResult<Product>;
  message?: string;
  statusCode?: number;
}
