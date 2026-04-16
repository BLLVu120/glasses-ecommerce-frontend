import React, { useState, useMemo, useEffect } from 'react';
import OrdersToolbar from '@/features/operation-staff/components/dashboard/OrdersToolbar';
import OrdersTable from '@/features/operation-staff/components/dashboard/OrdersTable';
import Pagination from '@/features/operation-staff/components/dashboard/Pagination';
import OrderProcessingDrawer from '@/features/operation-staff/components/dashboard/OrderProcessingDrawer.tsx';
import type { TabItem, PaginationInfo, BEOrder } from '@/features/operation-staff/types/types';
import { useProductionStore } from '@/features/operation-staff/store/productionStore.ts';

const ITEMS_PER_PAGE = 10;

interface OrdersSectionProps {
  orders?: BEOrder[];
  isSearchResult?: boolean;
}

const OrdersSection: React.FC<OrdersSectionProps> = ({
  orders: propOrders,
  isSearchResult = false,
}) => {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);

  // Use production store directly when no props provided
  const storeProcessingOrders = useProductionStore((state) => state.processingOrders);
  const loading = useProductionStore((state) => state.loading);
  const error = useProductionStore((state) => state.error);
  const fetchProcessingOrders = useProductionStore((state) => state.fetchProcessingOrders);
  const clearError = useProductionStore((state) => state.clearError);

  // Use prop orders if provided, otherwise use store orders
  const orders = propOrders || storeProcessingOrders;

  useEffect(() => {
    if (!propOrders) {
      fetchProcessingOrders();
    }
  }, [propOrders, fetchProcessingOrders]);

  const tabs: TabItem[] = isSearchResult
    ? [{ id: 'all', label: 'Kết quả tìm kiếm', isActive: activeTab === 'all' }]
    : [
        { id: 'all', label: 'Tất cả', isActive: activeTab === 'all' },
        { id: 'PROCESSING', label: 'Chờ xử lý', isActive: activeTab === 'PROCESSING' },
        { id: 'PRODUCED', label: 'Đã xử lý', isActive: activeTab === 'PRODUCED' },
      ];

  const filteredOrders = useMemo(() => {
    if (isSearchResult) return orders; // Don't filter search results
    if (activeTab === 'all') return orders;
    return orders.filter((order) => order.orderStatus === activeTab);
  }, [orders, activeTab, isSearchResult]);

  const pagination: PaginationInfo = useMemo(() => {
    const totalItems = filteredOrders?.length || 0;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE + 1;
    const endIndex = Math.min(currentPage * ITEMS_PER_PAGE, totalItems);

    return {
      currentPage,
      totalPages,
      totalItems,
      itemsPerPage: ITEMS_PER_PAGE,
      startIndex,
      endIndex,
    };
  }, [filteredOrders, currentPage]);

  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredOrders?.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredOrders, currentPage]);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setCurrentPage(1);
  };

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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleFilterClick = () => {
    console.log('Filter clicked');
  };

  const handleRetry = () => {
    clearError();
    fetchProcessingOrders();
  };

  // Show loading state
  if (loading && orders?.length === 0) {
    return (
      <section className="bg-white dark:bg-[#1a262d] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex-1 flex items-center justify-center py-6">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 dark:border-slate-700 border-t-blue-600 mx-auto mb-4"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-4 w-4 bg-blue-600 rounded-full animate-pulse"></div>
            </div>
          </div>
          <p className="text-slate-600 dark:text-slate-400 font-medium">Đang tải đơn hàng...</p>
          <p className="text-slate-500 dark:text-slate-500 text-sm mt-1">
            Vui lòng chờ trong giây lát
          </p>
        </div>
      </section>
    );
  }

  // Show error state
  if (error && orders?.length === 0) {
    return (
      <section className="bg-white dark:bg-[#1a262d] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex-1 flex items-center justify-center py-6">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600 dark:text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
            Không thể tải dữ liệu
          </h3>
          <p className="text-red-600 dark:text-red-400 mb-6 text-sm">{error}</p>
          <button
            onClick={handleRetry}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm hover:shadow-md"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Thử lại
          </button>
        </div>
      </section>
    );
  }

  // Show empty state for search results
  if (isSearchResult && orders?.length === 0) {
    return (
      <section className="bg-white dark:bg-[#1a262d] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex-1 flex items-center justify-center py-6">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
            Không tìm thấy kết quả
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Không có đơn hàng nào khớp với từ khóa tìm kiếm của bạn.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white dark:bg-[#1a262d] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex-1 flex flex-col">
      <OrdersToolbar tabs={tabs} onTabChange={handleTabChange} onFilterClick={handleFilterClick} />

      <OrdersTable
        orders={paginatedOrders}
        selectedOrders={selectedOrders}
        onSelectionChange={handleSelectionChange}
      />

      <Pagination pagination={pagination} onPageChange={handlePageChange} />

      <OrderProcessingDrawer />
    </section>
  );
};

export default OrdersSection;
