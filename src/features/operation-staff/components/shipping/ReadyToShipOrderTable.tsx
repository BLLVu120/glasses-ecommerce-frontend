import React from 'react';
import type { BEOrder } from '@/features/operation-staff/types/types';
import ShippingOrderRow from '@/features/operation-staff/components/shipping/ShippingOrderRow';

interface ReadyToShipOrderTableProps {
  orders: BEOrder[];
  selectedOrders: Set<string>;
  onSelectionChange: (orderId: string, selected: boolean) => void;
}

const ReadyToShipOrderTable: React.FC<ReadyToShipOrderTableProps> = ({
  orders,
  selectedOrders,
  onSelectionChange,
}) => {
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    orders.forEach((order) => {
      onSelectionChange(order.orderId, checked);
    });
  };

  const isAllSelected =
    orders?.length > 0 && orders?.every((order) => selectedOrders.has(order.orderId));
  const isIndeterminate = selectedOrders?.size > 0 && selectedOrders?.size < orders?.length;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50/50 dark:bg-slate-800/50 text-xs uppercase text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
            <th className="px-6 py-4 w-12">
              <input
                checked={isAllSelected}
                ref={(el) => {
                  if (el) el.indeterminate = isIndeterminate;
                }}
                onChange={handleSelectAll}
                className="rounded border-slate-300 text-primary focus:ring-primary/20 bg-white dark:bg-slate-700 dark:border-slate-600"
                type="checkbox"
              />
            </th>
            <th className="px-6 py-4 font-semibold">Mã đơn hàng</th>
            <th className="px-6 py-4 font-semibold">Thông tin giao hàng</th>
            <th className="px-6 py-4 font-semibold">Sản phẩm</th>
            <th className="px-6 py-4 font-semibold text-right">Tổng tiền</th>
            <th className="px-6 py-4 font-semibold">Ngày tạo</th>
            <th className="px-6 py-4 font-semibold">Trạng thái</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
          {orders?.map((order) => (
            <ShippingOrderRow
              key={order.orderId}
              order={order}
              isSelected={selectedOrders.has(order.orderId)}
              onSelectionChange={onSelectionChange}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReadyToShipOrderTable;
