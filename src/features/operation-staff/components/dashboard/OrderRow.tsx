import React from 'react';
import type { BEOrder } from '@/features/operation-staff/types/types';
import { useOrderDrawerStore } from '@/features/operation-staff/store/orderDrawerStore.ts';
import { useProductionStore } from '@/features/operation-staff/store/productionStore.ts';
import CopyButton from '@/features/operation-staff/components/common/CopyButton.tsx';

interface OrderRowProps {
  order: BEOrder;
  isSelected: boolean;
  onSelectionChange: (orderId: string, selected: boolean) => void;
}

const OrderRow: React.FC<OrderRowProps> = ({ order, isSelected, onSelectionChange }) => {
  const { openDrawer } = useOrderDrawerStore();
  const { startOrder } = useProductionStore();

  const handleProcessOrder = async () => {
    if (order && order.orderStatus !== 'PRODUCED') {
      try {
        await startOrder(order.orderId);
        openDrawer(order);
      } catch (error) {
        console.error('Failed to start order:', error);
      }
    }
  };

  const handleViewDetails = () => {
    if (order) {
      openDrawer(order);
    }
  };

  const getStatusStyles = () => {
    switch (order.orderStatus) {
      case 'PENDING':
      case 'AWAITING_VERIFICATION':
      case 'ON_HOLD':
        return 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300 border-yellow-100 dark:border-yellow-800';
      case 'CONFIRMED':
      case 'PREPARING':
      case 'PROCESSING':
        return 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-blue-100 dark:border-blue-800';
      case 'PRODUCED':
      case 'READY_TO_SHIP':
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-100 dark:border-emerald-800';
      case 'PACKAGING':
        return 'bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300 border-orange-100 dark:border-orange-800';
      case 'HANDED_TO_CARRIER':
        return 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border-purple-100 dark:border-purple-800';
      case 'SHIPPED':
      case 'DELIVERING':
      case 'DELIVERED':
      case 'COMPLETED':
        return 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300 border-green-100 dark:border-green-800';
      case 'CANCELLED':
        return 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300 border-red-100 dark:border-red-800';
      default:
        return 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400 border-slate-200 dark:border-slate-600';
    }
  };

  const getStatus = () => {
    switch (order.orderStatus) {
      case 'PENDING':
        return 'Chờ xử lý';
      case 'AWAITING_VERIFICATION':
        return 'Chờ xác minh';
      case 'ON_HOLD':
        return 'Tạm dừng';
      case 'CONFIRMED':
        return 'Đã xác nhận';
      case 'AWAITING_FINAL_PAYMENT':
        return 'Chờ thanh toán';
      case 'PREPARING':
        return 'Đang chuẩn bị';
      case 'PROCESSING':
        return 'Đang gia công';
      case 'PRODUCED':
        return 'Đã đóng gói';
      case 'PACKAGING':
        return 'Đang đóng gói';
      case 'HANDED_TO_CARRIER':
        return 'Đã bàn giao cho ĐVVC';
      case 'READY_TO_SHIP':
        return 'Sẵn sàng giao';
      case 'SHIPPED':
        return 'Đang vận chuyển';
      case 'DELIVERING':
        return 'Đang giao hàng';
      case 'DELIVERED':
        return 'Đã giao hàng';
      case 'COMPLETED':
        return 'Hoàn thành';
      case 'CANCELLED':
        return 'Đã hủy';
      default:
        return 'Chờ xử lý';
    }
  };

  return (
    <tr className={`group transition-colors`}>
      <td className="px-6 py-4 align-middle">
        <input
          checked={isSelected}
          onChange={(e) => onSelectionChange(order.orderId, e.target.checked)}
          className="rounded border-slate-300 text-primary focus:ring-primary/20 bg-white dark:bg-slate-700 dark:border-slate-600"
          type="checkbox"
        />
      </td>

      <td className="px-6 py-4 align-middle">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 dark:text-white">{order.orderId}</span>
            <CopyButton text={order.orderId} size="sm" />
          </div>
        </div>
      </td>

      <td className="px-6 py-4 align-middle">
        <div className="mb-1 text-xs text-slate-500">{order?.orderName || 'N/A'}</div>
      </td>

      <td className="px-6 py-4 align-middle">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">{order?.phoneNumber || 'N/A'}</span>
          {order?.phoneNumber && <CopyButton text={order.phoneNumber} size="sm" />}
        </div>
      </td>

      <td className="px-6 py-4 align-middle">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyles()}`}
        >
          {getStatus()}
        </span>
      </td>

      <td className="px-6 py-4 align-middle text-right">
        {order.orderStatus === 'PROCESSING' && (
          <button
            onClick={handleProcessOrder}
            className="inline-flex items-center justify-center px-4 py-2 text-xs font-bold rounded-lg transition-colors shadow-sm bg-blue-600 hover:bg-blue-700 text-white"
          >
            Xử lý ngay
          </button>
        )}
        {(order.orderStatus === 'PRODUCED' || order.orderStatus === 'PACKAGING' || order.orderStatus === 'HANDED_TO_CARRIER') && (
          <button
            onClick={handleViewDetails}
            className="inline-flex items-center justify-center px-4 py-2 text-xs font-bold rounded-lg transition-colors shadow-sm bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-300"
          >
            Xem chi tiết
          </button>
        )}
      </td>
    </tr>
  );
};

export default OrderRow;
