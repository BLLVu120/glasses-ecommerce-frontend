import React from 'react';
import { Truck } from 'lucide-react';
import type { BEOrder } from '@/features/operation-staff/types/types';

interface ShipperOrderRowProps {
  order: BEOrder;
  onStartDelivery: (orderId: string) => void;
  loading: boolean;
}

const ShipperOrderRow: React.FC<ShipperOrderRowProps> = ({ order, onStartDelivery, loading }) => {
  const getStatusStyles = () => {
    switch (order.orderStatus) {
      case 'READY_TO_SHIP':
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-100 dark:border-emerald-800';
      default:
        return 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400 border-slate-200 dark:border-slate-600';
    }
  };

  const getStatus = () => {
    switch (order.orderStatus) {
      case 'READY_TO_SHIP':
        return 'Sẵn sàng giao';
      default:
        return 'Chờ xử lý';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const handleStartDelivery = () => {
    onStartDelivery(order.orderId);
  };

  return (
    <tr className={`group transition-colors`}>
      <td className="px-6 py-4 align-middle">
        <div className="flex flex-col">
          <span className="font-bold text-slate-900 dark:text-white">{order.orderId}</span>
          <span className="text-xs text-slate-500">Khách: {order.customerId}</span>
        </div>
      </td>

      <td className="px-6 py-4 align-middle">
        <div className="flex flex-col">
          <span className="text-sm text-slate-900 dark:text-white">{order.deliveryAddress}</span>
          <span className="text-xs text-slate-500">{order.phoneNumber}</span>
        </div>
      </td>

      <td className="px-6 py-4 align-middle">
        <div className="flex flex-col">
          <span className="text-sm font-medium text-slate-900 dark:text-white">
            {order.items?.length || 0} sản phẩm
          </span>
          <span className="text-xs text-slate-500">
            {order.items?.map((item) => item.lensName).join(', ') || 'N/A'}
          </span>
        </div>
      </td>

      <td className="px-6 py-4 align-middle">
        <span className="text-sm font-bold text-slate-900 dark:text-white">
          {order.totalAmount?.toLocaleString('vi-VN') || '0'} VNĐ
        </span>
      </td>

      <td className="px-6 py-4 align-middle">
        <span className="text-sm text-slate-600 dark:text-slate-400">{formatDate()}</span>
      </td>

      <td className="px-6 py-4 align-middle">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyles()}`}
        >
          {getStatus()}
        </span>
      </td>

      <td className="px-6 py-4 align-middle">
        <button
          onClick={handleStartDelivery}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-1.5 bg-primary text-white text-sm rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Truck className="w-3 h-3" />
          {loading ? 'Đang xử lý...' : 'Bắt đầu vận chuyển'}
        </button>
      </td>
    </tr>
  );
};

export default ShipperOrderRow;
