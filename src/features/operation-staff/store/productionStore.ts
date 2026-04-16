import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { productionApi } from '@/features/operation-staff/api/production-api.ts';
import type { BEOrder, BEOrderItemStatus } from '@/features/operation-staff/types/types';

interface ProductionStore {
  // State
  processingOrders: BEOrder[];
  loading: boolean;
  error: string | null;

  // Actions
  fetchProcessingOrders: () => Promise<void>;
  startOrder: (orderId: string) => Promise<void>;
  finishOrder: (orderId: string) => Promise<void>;
  updateItemStatus: (orderItemId: string, status: string) => Promise<void>;
  clearError: () => void;
}

export const useProductionStore = create<ProductionStore>()(
  devtools(
    (set) => ({
      // Initial state
      processingOrders: [],
      loading: false,
      error: null,

      // Fetch processing orders
      fetchProcessingOrders: async () => {
        set({ loading: true, error: null });
        try {
          const response = await productionApi.getProcessingOrders();
          set({
            processingOrders: response,
            loading: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to fetch orders',
            loading: false,
          });
        }
      },

      // Start order production
      startOrder: async (orderId: string) => {
        set({ loading: true, error: null });
        try {
          const response = await productionApi.startOrder(orderId);
          const updatedOrder = response;

          // Update local state with returned order
          set((state) => ({
            processingOrders: state.processingOrders.map((order) =>
              order.orderId === orderId ? updatedOrder : order,
            ),
            loading: false,
          }));
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to start order',
            loading: false,
          });
        }
      },

      // Finish order production
      finishOrder: async (orderId: string) => {
        set({ loading: true, error: null });
        try {
          const response = await productionApi.finishOrder(orderId);
          const updatedOrder = response;

          // Update local state with returned order
          set((state) => ({
            processingOrders: state.processingOrders.map((order) =>
              order.orderId === orderId ? updatedOrder : order,
            ),
            loading: false,
          }));
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to finish order',
            loading: false,
          });
        }
      },

      // Update item status
      updateItemStatus: async (orderItemId: string, status: string) => {
        set({ loading: true, error: null });
        try {
          await productionApi.updateItemStatus(orderItemId, status);

          set((state) => ({
            processingOrders: state.processingOrders.map((order) => ({
              ...order,
              items: order.items.map((item) =>
                item.orderItemId === orderItemId
                  ? { ...item, status: status as BEOrderItemStatus }
                  : item,
              ),
            })),
            loading: false,
          }));
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to update item status',
            loading: false,
          });
        }
      },

      // Clear error
      clearError: () => set({ error: null }),
    }),
    {
      name: 'production-store',
    },
  ),
);
