import React from 'react';
import type { BEOrder } from '@/features/operation-staff/types/types';
import ShipperOrderRow from '@/features/shipper/components/dashboard/ShipperOrderRow';

interface ShipperOrderTableProps {
  orders: BEOrder[];
  onStartDelivery: (orderId: string) => void;
  loading: boolean;
}

const ShipperOrderTable: React.FC<ShipperOrderTableProps> = ({
  orders,
  onStartDelivery,
  loading,
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50/50 dark:bg-slate-800/50 text-xs uppercase text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
            <th className="px-6 py-4 font-semibold">Mã đơn hàng</th>
            <th className="px-6 py-4 font-semibold">Thông tin giao hàng</th>
            <th className="px-6 py-4 font-semibold">Sản phẩm</th>
            <th className="px-6 py-4 font-semibold text-right">Tổng tiền</th>
            <th className="px-6 py-4 font-semibold">Ngày tạo</th>
            <th className="px-6 py-4 font-semibold">Trạng thái</th>
            <th className="px-6 py-4 font-semibold text-center">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
          {orders?.map((order) => (
            <ShipperOrderRow
              key={order.orderId}
              order={order}
              onStartDelivery={onStartDelivery}
              loading={loading}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ShipperOrderTable;
