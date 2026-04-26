import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { BEOrder } from '@/features/operation-staff/types/types';

interface SearchStore {
  // State
  searchQuery: string;
  searchResults: BEOrder[];
  isSearching: boolean;

  // Actions
  setSearchQuery: (query: string) => void;
  searchOrders: (orders: BEOrder[], query: string) => void;
  clearSearch: () => void;
}

export const useSearchStore = create<SearchStore>()(
  devtools(
    (set) => ({
      // Initial state
      searchQuery: '',
      searchResults: [],
      isSearching: false,

      // Set search query
      setSearchQuery: (query: string) => {
        set({ searchQuery: query });
      },

      // Search orders
      searchOrders: (orders: BEOrder[], query: string) => {
        set({ isSearching: true });

        if (!query.trim()) {
          set({ searchResults: [], isSearching: false });
          return;
        }

        const filtered = orders.filter((order) => {
          const searchLower = query.toLowerCase();

          // Search by orderId (with # prefix support)
          if (order.orderId.toLowerCase().includes(searchLower.replace('#', ''))) {
            return true;
          }

          // Search by customer phone
          if (order.phoneNumber && order.phoneNumber.toLowerCase().includes(searchLower)) {
            return true;
          }

          // Search by orderName
          if (order.orderName && order.orderName.toLowerCase().includes(searchLower)) {
            return true;
          }

          return false;
        });

        set({ searchResults: filtered, isSearching: false });
      },

      // Clear search
      clearSearch: () => {
        set({ searchQuery: '', searchResults: [], isSearching: false });
      },
    }),
    {
      name: 'search-store',
    },
  ),
);
