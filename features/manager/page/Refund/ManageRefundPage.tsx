'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { useReadyRefunds, useCheckoutRefund } from '@/features/manager/hooks/useRefunds';
import type { RefundItem } from '../../types/refund';
import { fmt, getProductName } from '@/lib/utils';
import { CreateBatchModal } from '../../components/refund/CreateBatchModal';
import { CustomerCancelModal } from '../../components/refund/CustomerCancelModal';
import { RefundDetailModal } from '../../components/refund/RefundDetailModal';

export default function ManageRefundPage() {
  // 1. Lấy dữ liệu
  const { data: refunds = [], isLoading } = useReadyRefunds();
  const { mutateAsync: checkoutRefund } = useCheckoutRefund();

  // 2. State điều khiển UI
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [selectedRefund, setSelectedRefund] = useState<RefundItem | null>(null);
  const [searchQ, setSearchQ] = useState('');
  const [checkingAll, setCheckingAll] = useState(false);

  // Track ID đã hoàn tiền thành công cục bộ
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const isDone = (id: string) => completedIds.has(id);

  // 3. Logic xử lý Hoàn tất cả
  const handleCheckoutAll = async () => {
    const pendingRefunds = filtered.filter((r) => !isDone(r.refundId));
    if (pendingRefunds.length === 0) return;

    setCheckingAll(true);
    try {
      await Promise.all(pendingRefunds.map((r) => checkoutRefund(r.refundId)));
      setCompletedIds((prev) => new Set([...prev, ...pendingRefunds.map((r) => r.refundId)]));
      toast.success(`Đã hoàn tiền thành công ${pendingRefunds.length} đơn!`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Lỗi hoàn tiền hàng loạt');
    } finally {
      setCheckingAll(false);
    }
  };

  // 4. Filter dữ liệu (Không Paging)
  const filtered = refunds.filter((r) => {
    if (!r?.order) return false;
    const q = searchQ.toLowerCase();
    const name = getProductName(r.order) ?? '';

    return (
      !q ||
      (r.refundId ?? '').toLowerCase().includes(q) ||
      (r.order.orderId ?? '').toLowerCase().includes(q) ||
      (r.order.phoneNumber ?? '').includes(q) ||
      name.toLowerCase().includes(q)
    );
  });

  const pendingCount = refunds.filter((r) => !isDone(r.refundId)).length;

  return (
    <div className="min-h-screen bg-[#f7f8fa]">
      {showCreateModal && <CreateBatchModal onClose={() => setShowCreateModal(false)} />}
      {showCustomerModal && <CustomerCancelModal onClose={() => setShowCustomerModal(false)} />}

      {selectedRefund && (
        <RefundDetailModal
          refund={selectedRefund}
          onClose={() => {
            setSelectedRefund(null);
            setCompletedIds((prev) => new Set(prev).add(selectedRefund.refundId));
          }}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Quản lý Hoàn Tiền</h1>
            <p className="text-sm text-gray-500 mt-1">
              Có <span className="font-bold text-rose-600">{pendingCount}</span> khoản cần xử lý
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowCustomerModal(true)}
              className="px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-semibold rounded-xl shadow-sm hover:bg-gray-50 transition-colors"
            >
              Đơn khách hủy
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-indigo-600 text-white text-sm font-bold rounded-xl shadow-sm hover:bg-indigo-700 transition-colors"
            >
              + Tạo Batch (NSX Hủy)
            </button>
          </div>
        </div>

        {/* Toolbar: Search & Action */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-gray-700 px-4 py-2 bg-gray-100 rounded-lg">
              Tất cả danh sách
            </span>
          </div>

          <div className="flex w-full md:w-auto gap-3">
            <input
              type="text"
              placeholder="Tìm mã đơn, SĐT..."
              value={searchQ}
              onChange={(e) => setSearchQ(e.target.value)}
              className="w-full md:w-80 px-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-gray-50"
            />
            <button
              onClick={handleCheckoutAll}
              disabled={checkingAll || pendingCount === 0}
              className="px-4 py-2 bg-emerald-100 text-emerald-700 text-sm font-bold rounded-xl hover:bg-emerald-200 disabled:opacity-50 transition-colors shrink-0"
            >
              {checkingAll ? 'Đang xử lý...' : 'Hoàn tất cả'}
            </button>
          </div>
        </div>

        {/* Table List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {isLoading ? (
            <div className="py-20 text-center flex flex-col items-center">
              <div className="w-8 h-8 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-3" />
              <p className="text-sm text-gray-400">Đang tải dữ liệu...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-20 text-center text-gray-400">
              <p className="text-4xl mb-3">📭</p>
              <p className="text-sm">Không tìm thấy yêu cầu hoàn tiền nào</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                  <th className="p-4 pl-6">Mã Refund</th>
                  <th className="p-4">Thông tin đơn</th>
                  <th className="p-4">Số tiền</th>
                  <th className="p-4">Trạng thái</th>
                  <th className="p-4 pr-6 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((r) => {
                  const done = isDone(r.refundId);
                  return (
                    <tr key={r.refundId} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-4 pl-6">
                        <p className="text-sm font-mono text-gray-900 font-medium">
                          #{(r.refundId ?? '').slice(0, 8)}
                        </p>
                      </td>
                      <td className="p-4">
                        <p className="text-sm font-semibold text-gray-800">
                          {getProductName(r.order) ?? 'Đơn hàng'}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          SĐT: {r.order.phoneNumber || '—'}
                        </p>
                      </td>
                      <td className="p-4">
                        <p className="text-sm font-bold text-gray-900">{fmt(r.order.paidAmount)}</p>
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-flex px-2 py-1 text-[10px] font-bold uppercase rounded-md ${
                            done ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                          }`}
                        >
                          {done ? 'Đã hoàn tiền' : 'Chờ xử lý'}
                        </span>
                      </td>
                      <td className="p-4 pr-6 text-right">
                        <button
                          onClick={() => setSelectedRefund(r)}
                          className="px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                        >
                          Xem & Xử lý
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
