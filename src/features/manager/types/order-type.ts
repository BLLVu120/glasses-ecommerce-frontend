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
export interface Prescription1 {
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
  productId: string | null; // Đã thêm dựa theo JSON mới
  productVariantId: string | null;
  itemName: string | null;
  productName: string | null;
  productImage: string | null;
  variantName: string | null;
  orderItemType: 'IN_STOCK' | 'PRE_ORDER' | 'PREORDER';
  quantity: number;
  unitPrice: number;
  lensId: string | null;
  lensName: string | null;
  lensPrice: number;
  lensPriceTotal: number;
  totalPrice: number;
  status: 'IN_PRODUCTION' | 'COMPLETED' | 'PENDING' | string | null;
  prescription: Prescription | null;
}
export interface Payment2 {
  id: string;
  paymentMethod: string;
  paymentPurpose: string;
  amount: number;
  percentage: number | null;
  status: string;
  paymentDate: string | null;
  description: string | null;
  transactionReference: string | null;
}

export interface Payment {
  id: string;
  paymentMethod: string;
  paymentPurpose: string;
  amount: number;
  percentage: number | null;
  status: string;
  paymentDate: string | null;
  description: string | null;
  transactionReference: string | null;
}

export interface ShipperInfo {
  id: string;
  fullName: string | null;
  phone: string | null;
  email: string | null;
  imageUrl: string | null;
}

export interface BankInfo {
  bankName: string | null;
  bankAccountNumber: string | null;
  accountHolderName: string | null;
}

export interface Order {
  customerId: string;
  orderId: string;
  orderName: string | null;
  deliveryAddress: string;
  recipientName: string | null;
  phoneNumber: string;
  orderStatus:
    | 'PENDING'
    | 'ON_HOLD'
    | 'CONFIRMED'
    | 'PROCESSING'
    | 'PRODUCED'
    | 'SHIPPED'
    | 'COMPLETED'
    | 'CANCELLED';
  totalAmount: number;
  depositAmount: number;
  remainingAmount: number | null;
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

// Interface mới cho kết quả phân trang
export interface OrderPageResponse {
  items: Order[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

// Interface mới cho Query Parameters
export interface GetOrdersParams {
  status?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}

// features/manager/constants/order-status.ts

export interface StatusConfig {
  label: string;
  bg: string;
  text: string;
  dot: string;
  className?: string; // Thêm nếu bạn dùng shadcn
}

export const STATUS_CONFIG: Record<string, StatusConfig> = {
  PENDING: {
    label: 'Chờ xử lý',
    bg: 'bg-amber-100',
    text: 'text-amber-700',
    dot: 'bg-amber-500',
    className: 'bg-amber-100 text-amber-700 hover:bg-amber-100 border-none',
  },
  AWAITING_VERIFICATION: {
    label: 'Chờ xác minh',
    bg: 'bg-orange-100',
    text: 'text-orange-700',
    dot: 'bg-orange-500',
    className: 'bg-orange-100 text-orange-700 border-none',
  },
  ON_HOLD: {
    label: 'Tạm giữ',
    bg: 'bg-slate-100',
    text: 'text-slate-600',
    dot: 'bg-slate-400',
    className: 'bg-slate-100 text-slate-600 border-none',
  },
  CONFIRMED: {
    label: 'Đã xác nhận',
    bg: 'bg-blue-100',
    text: 'text-blue-700',
    dot: 'bg-blue-500',
    className: 'bg-blue-100 text-blue-700 border-none',
  },
  AWAITING_FINAL_PAYMENT: {
    label: 'Chờ thanh toán',
    bg: 'bg-indigo-100',
    text: 'text-indigo-700',
    dot: 'bg-indigo-500',
    className: 'bg-indigo-100 text-indigo-700 border-none',
  },
  PREPARING: {
    label: 'Đang chuẩn bị',
    bg: 'bg-purple-100',
    text: 'text-purple-700',
    dot: 'bg-purple-500',
    className: 'bg-purple-100 text-purple-700 border-none',
  },
  PROCESSING: {
    label: 'Đang xử lý',
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    dot: 'bg-blue-600',
    className: 'bg-blue-100 text-blue-800 border-none',
  },
  PRODUCED: {
    label: 'Đã sản xuất',
    bg: 'bg-teal-100',
    text: 'text-teal-700',
    dot: 'bg-teal-500',
    className: 'bg-teal-100 text-teal-700 border-none',
  },
  READY_TO_SHIP: {
    label: 'Sẵn sàng giao',
    bg: 'bg-cyan-100',
    text: 'text-cyan-700',
    dot: 'bg-cyan-500',
    className: 'bg-cyan-100 text-cyan-700 border-none',
  },
  SHIPPED: {
    label: 'Đã gửi hàng',
    bg: 'bg-sky-100',
    text: 'text-sky-700',
    dot: 'bg-sky-500',
    className: 'bg-sky-100 text-sky-700 border-none',
  },
  DELIVERING: {
    label: 'Đang giao',
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    dot: 'bg-blue-600',
    className: 'bg-blue-100 text-blue-800 border-none',
  },
  DELIVERED: {
    label: 'Đã giao',
    bg: 'bg-emerald-100',
    text: 'text-emerald-800',
    dot: 'bg-emerald-600',
    className: 'bg-emerald-100 text-emerald-800 border-none',
  },
  COMPLETED: {
    label: 'Hoàn thành',
    bg: 'bg-green-100',
    text: 'text-green-700',
    dot: 'bg-green-500',
    className: 'bg-green-100 text-green-700 border-none',
  },
  CANCELLED: {
    label: 'Đã huỷ',
    bg: 'bg-red-100',
    text: 'text-red-700',
    dot: 'bg-red-500',
    className: 'bg-red-100 text-red-700 border-none',
  },
  REFUNDED: {
    label: 'Đã hoàn tiền',
    bg: 'bg-pink-100',
    text: 'text-pink-700',
    dot: 'bg-pink-500',
    className: 'bg-pink-100 text-pink-700 border-none',
  },
};

export const MAIN_TABS = [
  'ALL',
  'PENDING',
  'CONFIRMED',
  'PROCESSING',
  'SHIPPED',
  'COMPLETED',
  'CANCELLED',
];
