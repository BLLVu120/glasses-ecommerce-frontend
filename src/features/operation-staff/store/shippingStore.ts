import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { productionApi } from '@/features/operation-staff/api/production-api.ts';
import type { BEOrder } from '@/features/operation-staff/types/types';

interface ShippingStore {
  // State
  readyToShipOrders: BEOrder[];
  loading: boolean;
  error: string | null;

  // Actions
  fetchReadyToShipOrders: () => Promise<void>;
  bulkReadyToShip: (orderIds: string[]) => Promise<void>;
  clearError: () => void;
}

export const useShippingStore = create<ShippingStore>()(
  devtools(
    (set) => ({
      // Initial state
      readyToShipOrders: [],
      loading: false,
      error: null,

      fetchReadyToShipOrders: async () => {
        set({ loading: true, error: null });
        try {
          const response = await productionApi.getReadyToShipOrders();
          set({
            readyToShipOrders: response,
            loading: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to fetch ready to ship orders',
            loading: false,
          });
        }
      },

      bulkReadyToShip: async (orderIds: string[]) => {
        set({ loading: true, error: null });
        try {
          await productionApi.bulkReadyToShip(orderIds);

          // Refresh the order list after successful action
          const response = await productionApi.getReadyToShipOrders();
          set({
            readyToShipOrders: response,
            loading: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to process orders',
            loading: false,
          });
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'shipping-store',
    },
  ),
);
