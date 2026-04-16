import React from 'react';
import type { TabItem } from '@/features/operation-staff/types/types';

interface OrdersTabsProps {
  tabs: TabItem[];
  onTabChange: (tabId: string) => void;
}

const OrdersTabs: React.FC<OrdersTabsProps> = ({ tabs, onTabChange }) => {
  return (
    <div className="flex gap-6 overflow-x-auto no-scrollbar">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`relative pb-3 text-sm font-medium whitespace-nowrap transition-colors ${
            tab.isActive
              ? 'text-primary font-bold'
              : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span className="ml-1.5 py-0.5 px-1.5 rounded-full bg-slate-100 dark:bg-slate-700 text-xs text-slate-600 dark:text-slate-300">
              {tab.count}
            </span>
          )}
          {tab.isActive && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full"></span>
          )}
        </button>
      ))}
    </div>
  );
};

export default OrdersTabs;
