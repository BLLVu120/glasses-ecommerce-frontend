export type { BEOrder, BEOrderStatus } from '@/features/operation-staff/types/types';

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  startIndex: number;
  endIndex: number;
}
