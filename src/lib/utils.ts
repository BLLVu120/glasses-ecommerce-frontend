import type { Order } from '@/features/manager/types/order-type';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const fmt = (n: number | null | undefined) => {
  if (n == null) return '—';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(n);
};

export const getProductName = (order: Order) => {
  const item = (order.items ?? []).find((i) => i.itemName || i.productName);
  return item ? item.itemName || item.productName : null;
};
