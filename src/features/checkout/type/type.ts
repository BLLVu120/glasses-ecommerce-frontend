export interface CheckoutItemPayload {
  productVariantId: string;
  lensId: string | null;
  quantity: number;
}

export interface CheckoutRequest {
  items: CheckoutItemPayload[];
}

export interface ItemRequirement {
  orderItemId: string;
  orderItemType: 'IN_STOCK' | 'PRE_ORDER';
  quantity: number;
  unitPrice: number;
  lensPrice: number;
  lensPriceTotal: number;
  baseItemTotal: number;
  itemTotal: number;
  paymentPercentage: number;
  requiredPayment: number;
}

export interface CheckoutResponse {
  code: number;
  message: string;
  result: {
    depositPercentage: number;
    requiredAmount: number;
    orderTotal: number;
    requiredPaymentTotal: number;
    remainingPaymentTotal: number;
    itemRequirements: ItemRequirement[];
    allowCOD: boolean;
    message: string;
  };
}

export interface BankInfo {
  bankName: string;
  bankAccountNumber: string;
  accountHolderName: string;
}
export interface CheckoutState {
  // State quản lý bước hiện tại (1, 2, 3)
  step: number;

  // State quản lý dữ liệu form
  shippingData: {
    name: string;
    address: string;
    phone: string; // Thêm vào
  };
  paymentMethod: string;
  bankInfo: BankInfo ;
  updateBankInfo: (data: Partial<BankInfo>) => void;
  // Các Actions (Hàm xử lý)
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  setPaymentMethod: (method: string) => void;
  updateShippingData: (data: Partial<CheckoutState['shippingData']>) => void;
  resetCheckout: () => void;
}
// Chỉ khai báo những gì màn hình Success cần dùng
export interface OrderDetailsData {
  orderId: string;
  recipientName: string; // Lấy tên để hiển thị "Cảm ơn [Tên]..."
  totalAmount: number; // Lấy tổng tiền để show biên lai (nếu cần)
}

export interface OrderDetailsResponse {
  code: number;
  message: string;
  result: OrderDetailsData;
}
