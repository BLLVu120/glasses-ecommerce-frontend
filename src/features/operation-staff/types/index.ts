export interface ApiResponse<T> {
  code: number;
  message: string;
  result: T;
}

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
  productVariantId: string;
  orderItemType: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  status: string;
  prescription: Prescription;
}

export interface Order {
  customerId: string;
  orderId: string;
  deliveryAddress: string;
  phoneNumber: string;
  orderStatus: string;
  totalAmount: number;
  depositAmount: number;
  items: OrderItem[];
  comboId: string;
  comboName: string;
  comboDiscountAmount: number;
  comboSnapshot: string;
}

export type ProcessingOrdersResponse = ApiResponse<Order[]>;
export type OrderResponse = ApiResponse<Order>;
