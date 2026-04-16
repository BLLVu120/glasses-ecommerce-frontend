import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { shipperApi } from '@/features/shipper/api/shipper-api.ts';
import type { BEOrder } from '@/features/operation-staff/types/types';

interface ShipperStore {
  // State
  readyToShipOrders: BEOrder[];
  acceptedOrders: BEOrder[];
  loading: boolean;
  error: string | null;

  // Actions
  fetchReadyToShipOrders: () => Promise<void>;
  acceptOrders: (orderIds: string[]) => Promise<void>;
  fetchAcceptedOrders: () => Promise<void>;
  startDelivery: (orderId: string) => Promise<void>;
  confirmDelivered: (orderId: string) => Promise<void>;
  clearError: () => void;
}

export const useShipperStore = create<ShipperStore>()(
  devtools(
    (set) => ({
      // Initial state
      readyToShipOrders: [],
      acceptedOrders: [],
      loading: false,
      error: null,

      fetchReadyToShipOrders: async () => {
        set({ loading: true, error: null });
        try {
          const response = await shipperApi.getReadyToShipOrders();
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

      acceptOrders: async (orderIds: string[]) => {
        set({ loading: true, error: null });
        try {
          await shipperApi.acceptOrders(orderIds);

          // const acceptedOrdersResponse = await shipperApi.getMyAcceptedOrders();
          set({
            // acceptedOrders: acceptedOrdersResponse,
            loading: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to accept orders',
            loading: false,
          });
        }
      },

      fetchAcceptedOrders: async () => {
        set({ loading: true, error: null });
        try {
          const response = await shipperApi.getMyAcceptedOrders();
          set({
            acceptedOrders: response,
            loading: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to fetch accepted orders',
            loading: false,
          });
        }
      },

      startDelivery: async (orderId: string) => {
        set({ loading: true, error: null });
        try {
          await shipperApi.startDelivery(orderId);

          // const response = await shipperApi.getMyAcceptedOrders();
          set({
            // acceptedOrders: response,
            loading: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to start delivery',
            loading: false,
          });
        }
      },

      confirmDelivered: async (orderId: string) => {
        set({ loading: true, error: null });
        try {
          await shipperApi.confirmDelivered(orderId);

          // const response = await shipperApi.getMyAcceptedOrders();
          set({
            // acceptedOrders: response,
            loading: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to confirm delivery',
            loading: false,
          });
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'shipper-store',
    },
  ),
);
