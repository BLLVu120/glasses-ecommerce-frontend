import type { Order, OrderItem, OrderPageResponse, Payment } from '@/features/manager/types/order-type';

const payments = (orderId: string): Payment[] => [
  {
    id: `pay_${orderId}_1`,
    paymentMethod: 'VNPAY',
    paymentPurpose: 'DEPOSIT',
    amount: 500000,
    percentage: 50,
    status: 'PAID',
    paymentDate: new Date().toISOString(),
    description: 'Thanh toán cọc',
    transactionReference: `TXN_${orderId}_1`,
  },
];

const item = (overrides: Partial<OrderItem> = {}): OrderItem => ({
  orderItemId: overrides.orderItemId ?? 'oi_001',
  productId: overrides.productId ?? 'p_001',
  productVariantId: overrides.productVariantId ?? 'v_001_01',
  itemName: overrides.itemName ?? 'Gọng kính',
  productName: overrides.productName ?? 'Kính gọng vuông Acetate Classic',
  productImage:
    overrides.productImage ??
    'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=800',
  variantName: overrides.variantName ?? 'Black',
  orderItemType: overrides.orderItemType ?? 'IN_STOCK',
  quantity: overrides.quantity ?? 1,
  unitPrice: overrides.unitPrice ?? 990000,
  lensId: overrides.lensId ?? null,
  lensName: overrides.lensName ?? null,
  lensPrice: overrides.lensPrice ?? 0,
  lensPriceTotal: overrides.lensPriceTotal ?? 0,
  totalPrice: overrides.totalPrice ?? 990000,
  status: overrides.status ?? 'PENDING',
  prescription: overrides.prescription ?? null,
});

export const mockOrders: Order[] = [
  {
    customerId: 'u_customer_001',
    orderId: 'o_1001',
    orderName: 'Đơn hàng #1001',
    deliveryAddress: '123 Đường Lê Lợi, Quận 1, TP.HCM',
    recipientName: 'An Tran',
    phoneNumber: '0900000003',
    orderStatus: 'PROCESSING',
    totalAmount: 990000,
    depositAmount: 500000,
    remainingAmount: 490000,
    paidAmount: 500000,
    items: [item({ orderItemId: 'oi_1001_01' })],
    payments: payments('o_1001'),
    shipperInfo: null,
    comboId: null,
    comboName: null,
    comboDiscountAmount: null,
    comboSnapshot: null,
    refundedAmount: 0,
    finalTotalAfterRefund: 990000,
    bankInfo: {
      bankName: null,
      bankAccountNumber: null,
      accountHolderName: null,
    },
  },
  {
    customerId: 'u_customer_001',
    orderId: 'o_1002',
    orderName: 'Đơn hàng #1002',
    deliveryAddress: '456 Đường Hai Bà Trưng, Quận 3, TP.HCM',
    recipientName: 'An Tran',
    phoneNumber: '0900000003',
    orderStatus: 'CONFIRMED',
    totalAmount: 1690000,
    depositAmount: 845000,
    remainingAmount: 845000,
    paidAmount: 845000,
    items: [item({ orderItemId: 'oi_1002_01', productId: 'p_002', productVariantId: 'v_002_01', unitPrice: 1690000, totalPrice: 1690000, variantName: 'Silver', productName: 'Kính gọng tròn Titanium Air' })],
    payments: payments('o_1002'),
    shipperInfo: null,
    comboId: null,
    comboName: null,
    comboDiscountAmount: null,
    comboSnapshot: null,
    refundedAmount: 0,
    finalTotalAfterRefund: 1690000,
    bankInfo: {
      bankName: null,
      bankAccountNumber: null,
      accountHolderName: null,
    },
  },
];

export const mockOrderPage = (page = 0, size = 10, items: Order[] = mockOrders): OrderPageResponse => {
  const start = page * size;
  const sliced = items.slice(start, start + size);
  return {
    items: sliced,
    page,
    size,
    totalElements: items.length,
    totalPages: Math.max(1, Math.ceil(items.length / size)),
  };
};
