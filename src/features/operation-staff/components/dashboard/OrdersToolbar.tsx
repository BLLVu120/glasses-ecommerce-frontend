import React from 'react';
import { Filter } from 'lucide-react';
import OrdersTabs from './OrdersTabs';
import type { TabItem } from '@/features/operation-staff/types/types';

interface OrdersToolbarProps {
  tabs: TabItem[];
  onTabChange: (tabId: string) => void;
  onFilterClick: () => void;
}

const OrdersToolbar: React.FC<OrdersToolbarProps> = ({ tabs, onTabChange, onFilterClick }) => {
  return (
    <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <OrdersTabs tabs={tabs} onTabChange={onTabChange} />

      <div className="flex items-center gap-3">
        <button
          onClick={onFilterClick}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
        >
          <Filter className="w-4 h-4" />
          Bộ lọc
        </button>
      </div>
    </div>
  );
};

export default OrdersToolbar;
