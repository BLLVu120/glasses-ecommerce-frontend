// 1. Định nghĩa Wrapper chung cho mọi API
export interface ApiResponse<T> {
  code: number;
  message: string;
  result: T;
}

// 2. Các type con nằm bên trong Order
export interface Prescription {
  id: string;
  imageUrl: string;
  odSphere: number;
  odCylinder: number;
  odAxis: number;
  odAdd: number;
  odPd: number;
  osSphere: number;
  osCylinder: number;
  osAxis: number;
  osAdd: number;
  osPd: number;
  note: string;
}

export interface OrderItem {
  orderItemId: string;
  productId: string;
  productVariantId: string;
  itemName: string;
  productName: string;
  productImage: string;
  variantName: string;
  orderItemType: string; // Ví dụ: 'IN_STOCK' | ...
  quantity: number;
  unitPrice: number;
  lensId: string;
  lensName: string;
  lensPrice: number;
  lensPriceTotal: number;
  totalPrice: number;
  status: string; // Ví dụ: 'IN_PRODUCTION' | ...
  prescription: Prescription;
}

export interface Payment {
  id: string;
  paymentMethod: string; // 'COD' | 'BANK_TRANSFER' | ...
  paymentPurpose: string; // 'DEPOSIT' | ...
  amount: number;
  percentage: number;
  status: string; // 'UNPAID' | 'PAID' | ...
  paymentDate: string; // ISO Date string
  description: string;
  transactionReference: string;
}

export interface ShipperInfo {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  imageUrl: string;
}

export interface BankInfo {
  bankName: string;
  bankAccountNumber: string;
  accountHolderName: string;
}

// 3. Type Order (Gộp các type con ở trên)
export interface Order {
  customerId: string;
  orderId: string;
  orderName: string;
  deliveryAddress: string;
  recipientName: string;
  phoneNumber: string;
  orderStatus: string; // 'PENDING' | 'CANCELLED' | ...
  totalAmount: number;
  depositAmount: number;
  remainingAmount: number;
  paidAmount: number;
  items: OrderItem[];
  payments: Payment[];
  shipperInfo: ShipperInfo;
  comboId: string;
  comboName: string;
  comboDiscountAmount: number;
  comboSnapshot: string;
  refundedAmount: number;
  finalTotalAfterRefund: number;
  bankInfo: BankInfo;
}

// 4. Type Refund Item (Nằm ngoài cùng trong mảng result)
export interface RefundItem {
  refundId: string;
  order: Order;
  refundAmount: number | null;
  refundPercentage: number | null;
  deductionAmount: number | null;
  refundStatus: string; // 'READY_FOR_REFUND' | ...
}

// ==============================================
// 1. WRAPPERS: Các interface bọc dữ liệu trả về
// ==============================================

// Interface chung cho response từ API
export interface ApiResponse<T> {
  code: number;
  result: T;
}

// Interface dùng khi dữ liệu trả về có phân trang
export interface PaginatedResult<T> {
  items: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

// ==============================================
// 2. DOMAIN TYPES: Cấu trúc chi tiết của Đơn hàng
// ==============================================

export interface Prescription {
  id: string;
  imageUrl: string;
  odSphere: number;
  odCylinder: number;
  odAxis: number;
  odAdd: number;
  odPd: number;
  osSphere: number;
  osCylinder: number;
  osAxis: number;
  osAdd: number;
  osPd: number;
  note: string;
}

export interface ShipperInfo {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  imageUrl: string;
}

export interface PaginationParams {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}
// Dành cho bước lấy danh sách đơn bị huỷ
export type CancelledPaidOrdersResponse = ApiResponse<PaginatedResult<Order>>;
