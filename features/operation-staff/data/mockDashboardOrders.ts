import type { Order } from '../types/types';

export const mockDashboardOrders: Order[] = [
  {
    id: '1',
    orderCode: '#ORD-2602-001',
    customerName: 'Nguyễn Văn A',
    sla: 'Còn 2 giờ',
    slaHours: 2,
    priority: 'high',
    productName: 'Gọng Titan + Tròng 1.6',
    productType: 'Cắt ánh sáng xanh · Chống vỡ',
    productFeatures: 'Premium lens',
    productIcon: 'glasses', // Changed from 'eyeglasses'
    paymentStatus: 'deposit_50',
    status: 'waiting_cutting',
    isActionable: true,
  },
  {
    id: '2',
    orderCode: '#ORD-2602-002',
    customerName: 'Trần Thị B',
    sla: 'Còn 1 ngày',
    slaHours: 24,
    priority: 'medium',
    productName: 'RayBan RB3025 (Có sẵn)',
    productType: 'Kính mát · Gold Frame',
    productFeatures: 'Ready stock',
    productIcon: 'glasses', // Changed from 'eyeglasses'
    paymentStatus: 'full_payment',
    status: 'waiting_packaging',
    isActionable: true,
  },
  {
    id: '3',
    orderCode: '#ORD-2602-003',
    customerName: 'Lê Văn C',
    sla: 'Còn 5 giờ',
    slaHours: 5,
    priority: 'medium',
    productName: 'Nhựa Dẻo + Tròng Đổi màu',
    productType: 'Photochromic · Grey',
    productFeatures: 'Color changing',
    productIcon: 'eye', // Changed from 'visibility'
    paymentStatus: 'unpaid',
    status: 'waiting_cutting',
    isActionable: false,
  },
  {
    id: '4',
    orderCode: '#ORD-2602-004',
    customerName: 'Phạm D',
    sla: 'Còn 2 ngày',
    slaHours: 48,
    priority: 'low',
    productName: 'Kim loại tròn + Tròng 1.67',
    productType: 'Siêu mỏng · Chống trầy',
    productFeatures: 'Ultra thin',
    productIcon: 'glasses', // Changed from 'eyeglasses'
    paymentStatus: 'full_payment',
    status: 'shipping',
    isActionable: true,
  },
];
