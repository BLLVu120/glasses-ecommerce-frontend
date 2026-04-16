import React from 'react';
import { X } from 'lucide-react';
import type { BEOrder } from '@/features/operation-staff/types/types';
import CopyButton from '@/features/operation-staff/components/common/CopyButton.tsx';

interface DrawerHeaderProps {
  order: BEOrder;
  onClose: () => void;
}

const DrawerHeader: React.FC<DrawerHeaderProps> = ({ order, onClose }) => {
  return (
    <header className="flex-none bg-white dark:bg-[#1a2e22] border-b border-slate-200 dark:border-slate-700 z-30">
      {/* Order ID & Close Button Row */}
      <div className="flex items-center justify-between px-8 py-5">
        <div className="flex items-center gap-3">
          <div>
            <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white leading-tight tracking-tight">
              <div className="mb-2">Đơn hàng: {order.orderName}</div>
              <div className="flex items-center gap-2">
                <span>Mã đơn: {order.orderId}</span>
                <CopyButton text={order.orderId} size="md" />
              </div>
            </h2>
          </div>
        </div>
        <button
          onClick={onClose}
          className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-slate-500 hover:text-slate-800"
        >
          <X className="w-6 h-6" />
        </button>
      </div>
    </header>
  );
};

export default DrawerHeader;
