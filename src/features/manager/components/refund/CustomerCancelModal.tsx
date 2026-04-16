// ─── Modal: Khách hàng hủy đơn (ĐÃ THÊM NÚT LOAD MORE ĐỂ XEM HẾT) ────────

import { useState } from 'react';
import { toast } from 'sonner';
import { useCancelledPaidOrders, useCreateBatch } from '../../hooks/useRefunds';
import { fmt, getProductName } from '@/lib/utils';
import type { Order } from '../../types/refund';

export function CustomerCancelModal({ onClose }: { onClose: () => void }) {
  // 1. Khởi tạo Params phân trang
  const [params, setParams] = useState({
    page: 0,
    size: 50, // Ban đầu load 50 đơn
    sortBy: 'createdAt',
    sortDir: 'desc' as const,
  });

  // 2. Lấy data từ API
  const { data: paginatedData, isLoading, isFetching } = useCancelledPaidOrders(params);

  // 3. Bóc tách an toàn
  const cancelledOrders: Order[] = paginatedData?.items || [];
  const totalElements = paginatedData?.totalElements || 0;

  // Kiểm tra xem còn đơn nào chưa hiển thị không
  const hasMore = cancelledOrders.length < totalElements;

  // 4. Hook tạo Batch
  const { mutateAsync: createBatch, isPending: isCreating } = useCreateBatch();

  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set());

  const toggleOrder = (orderId: string) => {
    setSelectedOrders((prev) => {
      const next = new Set(prev);
      if (next.has(orderId)) {
        next.delete(orderId);
      } else {
        next.add(orderId);
      }
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedOrders.size === cancelledOrders.length) {
      setSelectedOrders(new Set());
    } else {
      setSelectedOrders(new Set(cancelledOrders.map((o) => o.orderId)));
    }
  };

  const handleCreateBatch = async () => {
    if (selectedOrders.size === 0) return;
    try {
      const orderIds = Array.from(selectedOrders);
      await createBatch(orderIds);

      toast.success('Đã tạo batch hoàn tiền!');
      setTimeout(() => onClose(), 800);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Lỗi tạo batch';
      toast.error(message);
    }
  };

  // Hàm tải thêm: Tăng size lên thêm 50 đơn nữa
  const handleLoadMore = () => {
    setParams((prev) => ({ ...prev, size: prev.size + 50 }));
  };

  const totalSelected = cancelledOrders
    .filter((o) => selectedOrders.has(o.orderId))
    .reduce((s, o) => s + (o.paidAmount ?? 0), 0);

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <div>
            <h3 className="text-base font-bold text-gray-900">Hoàn tiền đơn khách hủy</h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Tổng cộng có {totalElements} đơn cần xử lý
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors"
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* body */}
        <div className="px-6 py-5 overflow-y-auto">
          {isLoading && cancelledOrders.length === 0 ? (
            <div className="flex flex-col items-center py-10 gap-3 text-gray-400">
              <div className="w-7 h-7 border-2 border-indigo-300 border-t-indigo-600 rounded-full animate-spin" />
              <p className="text-sm">Đang tải danh sách đơn hủy...</p>
            </div>
          ) : cancelledOrders.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              <p className="text-4xl mb-3">✅</p>
              <p className="text-sm font-medium">Không có đơn hủy nào cần hoàn tiền</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* chọn tất cả */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={
                      selectedOrders.size > 0 && selectedOrders.size === cancelledOrders.length
                    }
                    onChange={toggleAll}
                    className="w-4 h-4 rounded accent-indigo-600 cursor-pointer"
                  />
                  <span className="text-sm font-semibold text-gray-700">
                    Chọn tất cả ({cancelledOrders.length} đơn hiển thị)
                  </span>
                </label>
                <span className="text-xs text-rose-600 font-bold bg-rose-50 px-2.5 py-1 rounded-full">
                  {selectedOrders.size} đã chọn
                </span>
              </div>

              {/* danh sách đơn */}
              <div className="space-y-2 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                {cancelledOrders.map((order) => {
                  const name = getProductName(order);
                  const checked = selectedOrders.has(order.orderId);
                  return (
                    <label
                      key={order.orderId}
                      className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border cursor-pointer transition-all ${
                        checked
                          ? 'border-indigo-500 bg-indigo-50 shadow-sm'
                          : 'border-gray-100 bg-gray-50 hover:border-gray-200'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleOrder(order.orderId)}
                        className="w-4 h-4 rounded accent-indigo-600 shrink-0 cursor-pointer"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-800 truncate">
                          {name ?? order.orderName ?? 'Đơn không tên'}
                        </p>
                        <p className="text-[11px] text-gray-500 font-mono mt-0.5 uppercase tracking-wider">
                          #{(order.orderId ?? '').slice(-8)} • {order.phoneNumber}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p
                          className={`text-sm font-black ${checked ? 'text-indigo-700' : 'text-gray-900'}`}
                        >
                          {fmt(order.paidAmount)}
                        </p>
                        <p className="text-[10px] text-emerald-600 font-bold uppercase mt-1">
                          Đã thanh toán
                        </p>
                      </div>
                    </label>
                  );
                })}

                {/* NÚT TẢI THÊM NẾU CHƯA HIỂN THỊ HẾT */}
                {hasMore && (
                  <div className="pt-2 pb-1 flex justify-center">
                    <button
                      type="button"
                      onClick={handleLoadMore}
                      disabled={isFetching}
                      className="px-4 py-2 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors flex items-center gap-2"
                    >
                      {isFetching ? (
                        <div className="w-3 h-3 border-2 border-indigo-400 border-t-indigo-600 rounded-full animate-spin" />
                      ) : null}
                      {isFetching
                        ? 'Đang tải thêm...'
                        : `Hiển thị thêm (${totalElements - cancelledOrders.length} đơn nữa)`}
                    </button>
                  </div>
                )}
              </div>

              {/* tổng tiền hoàn */}
              {selectedOrders.size > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex justify-between items-center shadow-sm">
                  <span className="text-amber-800 font-bold text-xs uppercase tracking-wider">
                    Tổng tiền cần hoàn
                  </span>
                  <span className="text-lg font-black text-amber-700">{fmt(totalSelected)}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* footer */}
        {!isLoading && cancelledOrders.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-100 flex gap-3 shrink-0 bg-white">
            <button
              onClick={onClose}
              className="flex-1 py-3 text-sm font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              onClick={handleCreateBatch}
              disabled={isCreating || selectedOrders.size === 0}
              className="flex-[2] py-3 text-sm font-black text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:grayscale rounded-xl transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2"
            >
              {isCreating ? (
                <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                `⚡ TẠO BATCH HOÀN TIỀN (${selectedOrders.size})`
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
