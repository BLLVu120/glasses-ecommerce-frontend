import React, { useEffect } from 'react';
import KPISection from '@/features/operation-staff/components/dashboard/KPISection';
import OrdersSection from '@/features/operation-staff/components/dashboard/OrdersSection';
import { useSearchStore } from '@/features/operation-staff/store/searchStore';
import { useProductionStore } from '@/features/operation-staff/store/productionStore';

const DashboardPage: React.FC = () => {
  const { searchQuery, searchOrders, searchResults } = useSearchStore();
  const { processingOrders, fetchProcessingOrders } = useProductionStore();

  useEffect(() => {
    fetchProcessingOrders();
  }, [fetchProcessingOrders]);

  useEffect(() => {
    fetchProcessingOrders();
  }, [fetchProcessingOrders]);

  useEffect(() => {
    if (searchQuery.trim()) {
      searchOrders(processingOrders, searchQuery);
    }
  }, [searchQuery, processingOrders, searchOrders]);

  const displayOrders = searchQuery.trim() ? searchResults : processingOrders;

  return (
    <div className="flex flex-col gap-6 h-full">
      <KPISection />
      <OrdersSection orders={displayOrders} isSearchResult={!!searchQuery.trim()} />
    </div>
  );
};

export default DashboardPage;
