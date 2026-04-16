import React, { useState, useEffect } from 'react';
import { Package, Truck } from 'lucide-react';
import Pagination from '@/features/operation-staff/components/dashboard/Pagination';
import type { PaginationInfo } from '@/features/operation-staff/types/types';
import { useShippingStore } from '@/features/operation-staff/store/shippingStore.ts';
import ReadyToShipOrderTable from '@/features/operation-staff/components/shipping/ReadyToShipOrderTable.tsx';

const ITEMS_PER_PAGE = 10;

const ShippingPage: React.FC = () => {
  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);

  const readyToShipOrders = useShippingStore((state) => state.readyToShipOrders);
  const loading = useShippingStore((state) => state.loading);
  const error = useShippingStore((state) => state.error);
  const fetchReadyToShipOrders = useShippingStore((state) => state.fetchReadyToShipOrders);
  const bulkReadyToShip = useShippingStore((state) => state.bulkReadyToShip);
  const clearError = useShippingStore((state) => state.clearError);

  useEffect(() => {
    fetchReadyToShipOrders();
  }, [fetchReadyToShipOrders]);

  const pagination: PaginationInfo = {
    currentPage,
    totalPages: Math.ceil((readyToShipOrders?.length || 0) / ITEMS_PER_PAGE),
    totalItems: readyToShipOrders?.length || 0,
    itemsPerPage: ITEMS_PER_PAGE,
    startIndex: (currentPage - 1) * ITEMS_PER_PAGE + 1,
    endIndex: Math.min(currentPage * ITEMS_PER_PAGE, readyToShipOrders?.length || 0),
  };

  const paginatedOrders =
    readyToShipOrders?.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE) ||
    [];

  const handleSelectionChange = (orderId: string, selected: boolean) => {
    setSelectedOrders((prev) => {
      const newSet = new Set(prev);
      if (selected) {
        newSet.add(orderId);
      } else {
        newSet.delete(orderId);
      }
      return newSet;
    });
  };

  const handleBulkShipping = async () => {
    if (selectedOrders.size === 0) return;

    try {
      await bulkReadyToShip(Array.from(selectedOrders));
      setSelectedOrders(new Set());
    } catch (error) {
      console.error('Failed to process orders:', error);
    }
  };

  return (
    <div className="flex flex-col gap-6 h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-lg">
            <Truck className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Đóng gói</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Quản lý các đơn hàng sẵn sàng để đóng gói và vận chuyển
            </p>
          </div>
        </div>

        {selectedOrders.size > 0 && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-600 dark:text-slate-400">
              Đã chọn {selectedOrders.size} đơn hàng
            </span>
            <button
              onClick={handleBulkShipping}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Package className="w-4 h-4" />
              {loading ? 'Đang xử lý...' : 'Đóng gói'}
            </button>
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-red-700 dark:text-red-300">{error}</span>
            <button
              onClick={clearError}
              className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Orders Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Danh sách đơn hàng sẵn sàng giao ({readyToShipOrders?.length || 0})
          </h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-slate-500">Đang tải...</div>
          </div>
        ) : paginatedOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Package className="w-12 h-12 text-slate-400 mb-4" />
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
              Không có đơn hàng nào
            </h3>
            <p className="text-slate-500 dark:text-slate-400">
              Hiện tại không có đơn hàng nào sẵn sàng để giao.
            </p>
          </div>
        ) : (
          <ReadyToShipOrderTable
            orders={paginatedOrders}
            selectedOrders={selectedOrders}
            onSelectionChange={handleSelectionChange}
          />
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <Pagination pagination={pagination} onPageChange={setCurrentPage} />
      )}
    </div>
  );
};

export default ShippingPage;
