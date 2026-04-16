// src/types/order.ts

export interface Prescription {
  id: string;
  imageUrl: string | null;
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
  orderItemType: 'IN_STOCK' | 'PRE_ORDER' | string;
  quantity: number;
  unitPrice: number;
  lensId: string;
  lensName: string;
  lensPrice: number;
  lensPriceTotal: number;
  totalPrice: number;
  status: string; // VD: 'IN_PRODUCTION'
  prescription: Prescription | null;
}

export interface Payment {
  id: string;
  paymentMethod: string; // VD: 'COD'
  paymentPurpose: string; // VD: 'DEPOSIT'
  amount: number;
  percentage: number;
  status: string; // VD: 'UNPAID'
  paymentDate: string;
  description: string;
  transactionReference: string;
}

export interface ShipperInfo {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  imageUrl: string | null;
}

export interface BankInfo {
  bankName: string;
  bankAccountNumber: string;
  accountHolderName: string;
}

export interface Order {
  customerId: string;
  orderId: string;
  orderName: string | null;
  deliveryAddress: string;
  recipientName: string | null;
  phoneNumber: string;
  // Bổ sung đầy đủ các trạng thái mới vào đây
  orderStatus:
    | 'PENDING'
    | 'AWAITING_VERIFICATION'
    | 'ON_HOLD'
    | 'CONFIRMED'
    | 'AWAITING_FINAL_PAYMENT'
    | 'PREPARING'
    | 'PROCESSING'
    | 'PRODUCED'
    | 'READY_TO_SHIP'
    | 'SHIPPED'
    | 'DELIVERING'
    | 'DELIVERED'
    | 'COMPLETED'
    | 'CANCELLED'
    | 'REFUNDED';
  totalAmount: number;
  depositAmount: number;
  remainingAmount: number;
  paidAmount: number;
  items: OrderItem[];
  payments: Payment[];
  shipperInfo: ShipperInfo | null;
  comboId: string | null;
  comboName: string | null;
  comboDiscountAmount: number | null;
  comboSnapshot: string | null;
  refundedAmount: number;
  finalTotalAfterRefund: number;
  bankInfo: BankInfo;
}
// Interface dùng chung cho mọi API trả về phân trang
export interface PaginatedResponse<T> {
  items: T[]; // CHÚ Ý: Đây là items, không phải content
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface UseMyOrdersProps {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}

export interface GetOrdersParams {
  status?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}
