import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useOrders } from '@/features/manager/hooks/useOrders';
import { orderApi } from '@/features/manager/api/order-api';
import { fmt } from '@/lib/utils';
import {
  Loader2,
  Package,
  ChevronLeft,
  ChevronRight,
  Eye,
  CheckCircle,
  XCircle,
  RotateCcw,
} from 'lucide-react';
import { STATUS_CONFIG, type Order } from '@/features/manager/types/order-type';
import { OrderDetailModal } from '@/features/manager/components/oder/OrderDetailModal';

import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

// ─── STATUS BADGE ────────────────────────────────────────────
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

// ─── SELLER STATUS FILTER OPTIONS ────────────────────────────
const SELLER_STATUS_FILTER: Record<string, string> = {
  ALL: 'Tất cả trạng thái',
  AWAITING_VERIFICATION: 'Chờ xác minh',
  ON_HOLD: 'Tạm giữ',
  CONFIRMED: 'Đã xác nhận',
  PREPARING: 'Đang chuẩn bị',
  PROCESSING: 'Đang gia công',
  PRODUCED: 'Đã gia công',
  PACKAGING: 'Đang đóng gói',
  HANDED_TO_CARRIER: 'Bàn giao ĐVVC',
  COMPLETED: 'Hoàn thành',
  CANCELLED: 'Đã huỷ',
};

// ─── PAGE ────────────────────────────────────────────────────
export default function SellerOrderPage() {
  const queryClient = useQueryClient();
  const [queryParams, setQueryParams] = useState({
    page: 0,
    size: 10,
    status: 'ALL',
    sortDir: 'desc' as 'asc' | 'desc',
    sortBy: 'createdAt',
  });
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const { orders, totalPages, loading } = useOrders({
    page: queryParams.page,
    size: queryParams.size,
    status: queryParams.status === 'ALL' ? undefined : queryParams.status,
  });

  const refreshOrders = () => {
    queryClient.invalidateQueries({ queryKey: ['orders'] });
  };

  const handleVerify = async (orderId: string, isApproved: boolean) => {
    setActionLoading(true);
    try {
      await orderApi.verifyOrder(orderId, isApproved);
      toast.success(isApproved ? 'Đã xác nhận đơn hàng!' : 'Đã yêu cầu gửi lại đơn!');
      setSelectedOrder(null);
      refreshOrders();
    } catch (error) {
      console.error('Verify error:', error);
      toast.error('Có lỗi xảy ra, vui lòng thử lại.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (orderId: string) => {
    const confirmed = window.confirm(
      'Bạn có chắc muốn từ chối đơn hàng này? Đơn sẽ bị huỷ và tồn kho sẽ được hoàn lại.',
    );
    if (!confirmed) return;

    setActionLoading(true);
    try {
      await orderApi.rejectOrder(orderId);
      toast.success('Đã từ chối đơn hàng!');
      setSelectedOrder(null);
      refreshOrders();
    } catch (error) {
      console.error('Reject error:', error);
      toast.error('Có lỗi xảy ra, vui lòng thử lại.');
    } finally {
      setActionLoading(false);
    }
  };

  // Check if seller can act on this order
  const canVerify = (order: Order) =>
    ['AWAITING_VERIFICATION', 'ON_HOLD', 'PENDING'].includes(order.orderStatus);

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      {/* Order Detail Modal with seller actions */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          extraFooter={
            canVerify(selectedOrder) ? (
              <div className="flex items-center gap-3 w-full">
                <button
                  onClick={() => handleReject(selectedOrder.orderId)}
                  disabled={actionLoading}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-red-200 text-red-600 font-bold text-xs uppercase tracking-wider hover:bg-red-50 hover:border-red-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <XCircle size={16} />
                  Từ chối
                </button>
                <button
                  onClick={() => handleVerify(selectedOrder.orderId, false)}
                  disabled={actionLoading}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-orange-200 text-orange-600 font-bold text-xs uppercase tracking-wider hover:bg-orange-50 hover:border-orange-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <RotateCcw size={16} />
                  Yêu cầu gửi lại
                </button>
                <button
                  onClick={() => handleVerify(selectedOrder.orderId, true)}
                  disabled={actionLoading}
                  className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CheckCircle size={16} />
                  {actionLoading ? 'Đang xử lý...' : 'Xác nhận & Chuyển vận hành'}
                </button>
              </div>
            ) : undefined
          }
        />
      )}

      <div className="max-w-6xl mx-auto px-6 py-10">
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-orange-600 rounded-xl shadow-lg shadow-orange-200 text-white">
                <Package size={24} />
              </div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                Xử lý đơn hàng
              </h1>
            </div>
            <p className="text-slate-500 font-medium text-sm">
              Xác minh và xử lý đơn hàng từ khách hàng
            </p>
          </div>

          <div className="w-full md:w-[240px]">
            <Select
              value={queryParams.status}
              onValueChange={(value) => setQueryParams((p) => ({ ...p, status: value, page: 0 }))}
            >
              <SelectTrigger className="h-11 bg-white border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-orange-500 focus:ring-offset-0 transition-all font-semibold text-slate-700">
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-slate-100 shadow-xl max-h-[300px]">
                {Object.entries(SELLER_STATUS_FILTER).map(([key, label]) => {
                  const cfg = STATUS_CONFIG[key];
                  return (
                    <SelectItem
                      key={key}
                      value={key}
                      className="font-medium text-slate-600 cursor-pointer focus:bg-orange-50 focus:text-orange-700 py-2"
                    >
                      <div className="flex items-center gap-2">
                        {cfg && <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />}
                        {label}
                      </div>
                    </SelectItem>
                  );
                })}
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
                {orders.length === 0 && !loading ? (
                  <tr>
                    <td colSpan={5} className="py-20 text-center text-slate-400 font-medium">
                      Không có đơn hàng nào
                    </td>
                  </tr>
                ) : (
                  orders.map((o) => (
                    <tr
                      key={o.orderId}
                      className="group hover:bg-orange-50/30 transition-colors cursor-pointer"
                      onClick={() => setSelectedOrder(o)}
                    >
                      <td className="pl-8 pr-4 py-5 font-bold text-slate-900 text-sm">
                        #{o.orderId.slice(0, 8)}
                      </td>
                      <td className="px-4 py-5">
                        <div className="font-bold text-slate-700 text-sm">
                          {o.recipientName || 'N/A'}
                        </div>
                        <div className="text-xs text-slate-400 font-medium mt-0.5">
                          {o.phoneNumber}
                        </div>
                      </td>
                      <td className="px-4 py-5 text-right font-black text-slate-900 text-sm">
                        {fmt(o.totalAmount)}
                      </td>
                      <td className="px-4 py-5 text-center">
                        <StatusBadge status={o.orderStatus} />
                      </td>
                      <td className="pl-4 pr-8 py-5 text-right">
                        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-orange-600 group-hover:text-white transition-all shadow-sm group-hover:shadow-md">
                          <Eye size={16} />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {loading && (
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl shadow-xl flex items-center gap-3 border border-slate-100">
                <Loader2 className="animate-spin text-orange-600" size={20} />
                <span className="text-sm font-bold text-slate-700">Đang tải...</span>
              </div>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="mt-8 flex items-center justify-between px-2">
          <span className="text-sm font-bold text-slate-500">
            Trang {queryParams.page + 1} / {totalPages || 1}
          </span>
          <div className="flex gap-2">
            <button
              disabled={queryParams.page === 0 || loading}
              onClick={() => setQueryParams((p) => ({ ...p, page: p.page - 1 }))}
              className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-40 transition-all shadow-sm"
            >
              <ChevronLeft size={18} strokeWidth={2.5} />
            </button>
            <button
              disabled={queryParams.page + 1 >= totalPages || loading}
              onClick={() => setQueryParams((p) => ({ ...p, page: p.page + 1 }))}
              className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-40 transition-all shadow-sm"
            >
              <ChevronRight size={18} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
