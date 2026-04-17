'use client';

import { useState } from 'react';
import { useOrders } from '@/features/manager/hooks/useOrders';
import { fmt } from '@/lib/utils';
import { Loader2, Package, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { STATUS_CONFIG, type Order } from '../../types/order-type';
import { OrderDetailModal } from '../../components/oder/OrderDetailModal';

// ─── SHADCN UI IMPORTS ──────────────────────────────────────
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// ─── COMPONENTS ─────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] ?? {
    label: status,
    dot: 'bg-gray-400',
    className: 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-transparent',
  };

  return (
    <Badge
      variant="outline"
      className={`inline-flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg text-[11px] font-bold tracking-wide w-[140px] shadow-sm transition-all ${cfg.className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${cfg.dot}`} />
      {cfg.label}
    </Badge>
  );
}

// ─── PAGE ───────────────────────────────────────────────────

export default function ManagerOrderPage() {
  const [queryParams, setQueryParams] = useState({
    page: 0,
    size: 10,
    status: 'ALL',
    sortDir: 'desc' as 'asc' | 'desc',
    sortBy: 'createdAt',
  });
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const { orders, totalPages, loading } = useOrders({
    page: queryParams.page,
    size: queryParams.size,
    status: queryParams.status === 'ALL' ? undefined : queryParams.status,
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      {selectedOrder && (
        <OrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      )}

      <div className="max-w-6xl mx-auto px-6 py-10">
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-600 rounded-xl shadow-lg shadow-blue-200 text-white">
                <Package size={24} />
              </div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                Quản lý đơn hàng
              </h1>
            </div>
            <p className="text-slate-500 font-medium text-sm">
              Quản lý và theo dõi tiến độ đơn hàng hệ thống
            </p>
          </div>

          {/* Shadcn Select Dropdown */}
          <div className="w-full md:w-[240px]">
            <Select
              value={queryParams.status}
              onValueChange={(value) => setQueryParams((p) => ({ ...p, status: value, page: 0 }))}
            >
              <SelectTrigger className="h-11 bg-white border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 transition-all font-semibold text-slate-700">
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-slate-100 shadow-xl max-h-[300px]">
                <SelectItem 
                  value="ALL" 
                  className="font-bold text-slate-800 cursor-pointer focus:bg-slate-50 py-2.5"
                >
                  Tất cả trạng thái
                </SelectItem>
                <div className="h-px bg-slate-100 my-1 mx-2" /> {/* Divider */}
                {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                  <SelectItem 
                    key={key} 
                    value={key}
                    className="font-medium text-slate-600 cursor-pointer focus:bg-blue-50 focus:text-blue-700 py-2"
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${config.dot}`} />
                      {config.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </header>

        <div className="bg-white rounded-[32px] shadow-sm border border-slate-200/60 overflow-hidden relative">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="pl-8 pr-4 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                    Mã đơn
                  </th>
                  <th className="px-4 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                    Khách hàng
                  </th>
                  <th className="px-4 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right">
                    Giá trị
                  </th>
                  <th className="px-4 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center">
                    Trạng thái
                  </th>
                  <th className="pl-4 pr-8 py-5"></th>
                </tr>
              </thead>

              <tbody
                className={`divide-y divide-slate-50 transition-opacity duration-300 ${loading ? 'opacity-40' : 'opacity-100'}`}
              >
                {orders.map((o) => (
                  <tr
                    key={o.orderId}
                    className="group hover:bg-blue-50/30 transition-colors cursor-pointer"
                    onClick={() => setSelectedOrder(o)}
                  >
                    <td className="pl-8 pr-4 py-5 font-bold text-slate-900 text-sm">
                      #{o.orderId.slice(0, 8)}
                    </td>
                    <td className="px-4 py-5">
                      <div className="font-bold text-slate-700 text-sm">
                        {o.recipientName || 'N/A'}
                      </div>
                      <div className="text-xs text-slate-400 font-medium mt-0.5">{o.phoneNumber}</div>
                    </td>
                    <td className="px-4 py-5 text-right font-black text-slate-900 text-sm">
                      {fmt(o.totalAmount)}
                    </td>
                    <td className="px-4 py-5 text-center">
                      <StatusBadge status={o.orderStatus} />
                    </td>
                    <td className="pl-4 pr-8 py-5 text-right">
                      <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm group-hover:shadow-md">
                        <Eye size={16} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {loading && (
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl shadow-xl flex items-center gap-3 border border-slate-100">
                <Loader2 className="animate-spin text-blue-600" size={20} />
                <span className="text-sm font-bold text-slate-700">Đang tải...</span>
              </div>
            </div>
          )}
        </div>

        {/* Modern Pagination */}
        <div className="mt-8 flex items-center justify-between px-2">
          <span className="text-sm font-bold text-slate-500">
            Trang {queryParams.page + 1} / {totalPages || 1}
          </span>
          <div className="flex gap-2">
            <button
              disabled={queryParams.page === 0 || loading}
              onClick={() => setQueryParams((p) => ({ ...p, page: p.page - 1 }))}
              className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-40 disabled:hover:bg-white disabled:hover:border-slate-200 transition-all shadow-sm"
            >
              <ChevronLeft size={18} strokeWidth={2.5} />
            </button>
            <button
              disabled={queryParams.page + 1 >= totalPages || loading}
              onClick={() => setQueryParams((p) => ({ ...p, page: p.page + 1 }))}
              className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-40 disabled:hover:bg-white disabled:hover:border-slate-200 transition-all shadow-sm"
            >
              <ChevronRight size={18} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}