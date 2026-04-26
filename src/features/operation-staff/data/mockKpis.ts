import type { KPIData } from '@/features/operation-staff/types/types';

export const mockKpis: KPIData[] = [
  {
    id: 'waiting-orders',
    title: 'Tổng đơn chờ',
    value: 22,
    unit: 'đơn hàng',
    percentage: 45,
    variant: 'neutral',
    icon: 'file-text',
    description: 'Đơn hàng cần xử lý',
  },
  {
    id: 'urgent-orders',
    title: 'Gấp / Trễ SLA',
    value: 5,
    unit: 'cần xử lý ngay',
    percentage: 20,
    variant: 'critical',
    icon: 'warning',
    description: 'Đơn hàng sắp trễ hạn',
  },
  {
    id: 'ready-orders',
    title: 'Sẵn sàng gói',
    value: 15,
    unit: 'đã xong gia công',
    percentage: 68,
    variant: 'success',
    icon: 'package',
    description: 'Đơn hàng hoàn thành',
  },
];
