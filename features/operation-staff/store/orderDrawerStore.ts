import { create } from 'zustand';
import type { BEOrder, DrawerState } from '@/features/operation-staff/types/types';

interface OrderDrawerStore extends DrawerState {
  openDrawer: (order: BEOrder) => void;
  closeDrawer: () => void;
  setSelectedOrder: (order: BEOrder | null) => void;
}

export const useOrderDrawerStore = create<OrderDrawerStore>((set) => ({
  isOpen: false,
  selectedOrder: null,

  openDrawer: (order) => set({ isOpen: true, selectedOrder: order }),
  closeDrawer: () => set({ isOpen: false, selectedOrder: null }),
  setSelectedOrder: (order) => set({ selectedOrder: order }),
}));
