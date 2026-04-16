import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { PackageOpen, AlertCircle, ShoppingBag, RefreshCcw, ChevronLeft, ChevronRight } from 'lucide-react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

import { profileApi } from '../api/api';
import type { BEFeedback } from "@/features/profile/types";
import FeedbackModal from "@/features/profile/components/feedback/FeedbackModal.tsx";
import FeedbackPreview from "@/features/profile/components/feedback/FeedbackPreview.tsx";

import { useMyOrders } from '../hooks/useMyOrders';
import type { Order, OrderItem } from '../types/order';
import { isAxiosError } from 'axios';
import { fmt } from '@/lib/utils';
import { VnpayCheckoutButton } from '@/features/checkout/components/VnpayCheckoutButton';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<string, { color: string; label: string; dot: string; tab: string }> = {
  PENDING: {
    color: 'bg-amber-50 text-amber-700 border-amber-200',
    label: 'Chờ xử lý',
    dot: 'bg-amber-500',
    tab: 'text-amber-600 border-amber-500 bg-amber-50',
  },
  ON_HOLD: {
    color: 'bg-gray-100 text-gray-600 border-gray-200',
    label: 'Tạm giữ',
    dot: 'bg-gray-400',
    tab: 'text-gray-600 border-gray-400 bg-gray-100',
  },
  CONFIRMED: {
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    label: 'Đã xác nhận',
    dot: 'bg-emerald-500',
    tab: 'text-emerald-600 border-emerald-500 bg-emerald-50',
  },
  PROCESSING: {
    color: 'bg-blue-50 text-blue-700 border-blue-200',
    label: 'Đang xử lý',
    dot: 'bg-blue-500',
    tab: 'text-blue-600 border-blue-500 bg-blue-50',
  },
  PREPARING: {
    color: 'bg-violet-50 text-violet-700 border-violet-200',
    label: 'Đang chuẩn bị',
    dot: 'bg-violet-500',
    tab: 'text-violet-600 border-violet-500 bg-violet-50',
  },
  PRODUCED: {
    color: 'bg-teal-50 text-teal-700 border-teal-200',
    label: 'Đã sản xuất',
    dot: 'bg-teal-500',
    tab: 'text-teal-600 border-teal-500 bg-teal-50',
  },
  DELIVERING: {
    color: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    label: 'Đang giao hàng',
    dot: 'bg-cyan-500',
    tab: 'text-cyan-600 border-cyan-500 bg-cyan-50',
  },
  SHIPPED: {
    color: 'bg-sky-50 text-sky-700 border-sky-200',
    label: 'Đã gửi hàng',
    dot: 'bg-sky-500',
    tab: 'text-sky-600 border-sky-500 bg-sky-50',
  },
  COMPLETED: {
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    label: 'Hoàn thành',
    dot: 'bg-emerald-500',
    tab: 'text-emerald-600 border-emerald-500 bg-emerald-50',
  },
  CANCELLED: {
    color: 'bg-rose-50 text-rose-700 border-rose-200',
    label: 'Đã huỷ',
    dot: 'bg-rose-500',
    tab: 'text-rose-600 border-rose-500 bg-rose-50',
  },
  REFUNDED: {
    color: 'bg-orange-50 text-orange-700 border-orange-200',
    label: 'Đã hoàn tiền',
    dot: 'bg-orange-500',
    tab: 'text-orange-600 border-orange-500 bg-orange-50',
  },
  AWAITING_VERIFICATION: {
    color: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    label: 'Chờ xác minh',
    dot: 'bg-yellow-500',
    tab: 'text-yellow-600 border-yellow-500 bg-yellow-50',
  },
  AWAITING_FINAL_PAYMENT: {
    color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    label: 'Chờ thanh toán',
    dot: 'bg-indigo-500',
    tab: 'text-indigo-600 border-indigo-500 bg-indigo-50',
  },
};

const ITEM_STATUS: Record<string, string> = {
  IN_PRODUCTION: 'Đang sản xuất',
  PRODUCED: 'Đã sản xuất',
  PENDING: 'Chờ xử lý',
  COMPLETED: 'Hoàn thành',
};

const ALL_STATUSES = Object.keys(STATUS_CONFIG);

// ─── PrescriptionImage ────────────────────────────────────────────────────────

function PrescriptionImage({ imageUrl }: { imageUrl: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="mt-2 flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-800 underline underline-offset-2"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        Xem ảnh đơn kính
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
          onClick={() => setOpen(false)}
        >
          <div className="relative max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setOpen(false)}
              className="absolute -top-3 -right-3 w-7 h-7 bg-white rounded-full shadow flex items-center justify-center text-gray-500 hover:text-gray-800"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img
              src={imageUrl}
              alt="Ảnh đơn kính"
              className="w-full rounded-2xl shadow-2xl object-contain max-h-[80vh]"
            />
          </div>
        </div>
      )}
    </>
  );
}

// ─── OrderItem Card ───────────────────────────────────────────────────────────

function OrderItemCard({
  item,
  orderName,
}: {
  item: OrderItem;
  index: number;
  total: number;
  orderName?: string | null;
  orderStatus: string;
  orderId: string;
}) {
  const productLabel =
    item.productName ||
    item.itemName ||
    orderName ||
    (item.orderItemType === 'PRE_ORDER' ? 'Sản phẩm đặt trước' : 'Sản phẩm có sẵn');

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-4 space-y-3">
      <div className="flex justify-between items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${item.orderItemType === 'PRE_ORDER' ? 'bg-violet-100 text-violet-700' : 'bg-emerald-100 text-emerald-700'}`}
            >
              {item.orderItemType === 'PRE_ORDER' ? 'Đặt trước' : 'Hàng có sẵn'}
            </span>
            {item.status && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-100 text-teal-700 font-semibold">
                {ITEM_STATUS[item.status] ?? item.status}
              </span>
            )}
          </div>
          <p className="text-sm font-semibold text-gray-800">{productLabel}</p>
          {item.variantName && (
            <p className="text-xs text-gray-500 mt-0.5">🏷️ {item.variantName}</p>
          )}
          {item.lensName && item.lensPrice != null && (
            <p className="text-xs text-indigo-500 mt-0.5">
              🔭 {item.lensName} &nbsp;+&nbsp; {fmt(item.lensPrice)}
            </p>
          )}
        </div>
        <p className="text-sm font-bold text-gray-800 shrink-0">{fmt(item.totalPrice)}</p>
      </div>

      <div className="grid grid-cols-3 gap-2 text-sm">
        <div className="bg-gray-50 rounded-lg p-2 text-center">
          <p className="text-[10px] text-gray-400 mb-0.5">Số lượng</p>
          <p className="font-semibold text-gray-700">{item.quantity}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-2 text-center">
          <p className="text-[10px] text-gray-400 mb-0.5">Đơn giá</p>
          <p className="font-semibold text-gray-700 text-xs">{fmt(item.unitPrice)}</p>
        </div>
        <div className="bg-indigo-50 rounded-lg p-2 text-center">
          <p className="text-[10px] text-indigo-400 mb-0.5">Thành tiền</p>
          <p className="font-bold text-indigo-700 text-xs">{fmt(item.totalPrice)}</p>
        </div>
      </div>

      {item.prescription && (
        <div className="pt-3 border-t border-dashed border-gray-100 space-y-2">
          <p className="text-xs font-semibold text-gray-500">📋 Thông số đơn kính</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-blue-50 rounded-lg p-2.5">
              <p className="text-blue-500 font-semibold mb-1.5">Mắt phải (OD)</p>
              {[
                ['Cầu', item.prescription.odSphere],
                ['Trụ', item.prescription.odCylinder],
                ['Trục', item.prescription.odAxis],
                ['PD', item.prescription.odPd],
              ].map(([k, v]) => (
                <div key={k as string} className="flex justify-between text-gray-600">
                  <span className="text-gray-400">{k}:</span>
                  <span className="font-medium">{v}</span>
                </div>
              ))}
            </div>
            <div className="bg-purple-50 rounded-lg p-2.5">
              <p className="text-purple-500 font-semibold mb-1.5">Mắt trái (OS)</p>
              {[
                ['Cầu', item.prescription.osSphere],
                ['Trụ', item.prescription.osCylinder],
                ['Trục', item.prescription.osAxis],
                ['PD', item.prescription.osPd],
              ].map(([k, v]) => (
                <div key={k as string} className="flex justify-between text-gray-600">
                  <span className="text-gray-400">{k}:</span>
                  <span className="font-medium">{v}</span>
                </div>
              ))}
            </div>
          </div>
          {item.prescription.imageUrl && (
            <PrescriptionImage imageUrl={item.prescription.imageUrl} />
          )}
        </div>
      )}
    </div>
  );
}

// ─── OrderCard ────────────────────────────────────────────────────────────────

function OrderCard({ order, allFeedbacks }: { order: Order, allFeedbacks: BEFeedback[] }) {
  const [expanded, setExpanded] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const queryClient = useQueryClient();

  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<OrderItem | null>(null);
  const [selectedFeedback, setSelectedFeedback] = useState<BEFeedback | null>(null);

  // Lấy feedback của toàn bộ đơn hàng
  const orderFeedback = allFeedbacks.find(f => f.orderId === order.orderId) || null;
  const hasFeedback = !!orderFeedback;

  const statusCfg = STATUS_CONFIG[order.orderStatus] ?? {
    color: 'bg-gray-50 text-gray-600 border-gray-200',
    label: order.orderStatus,
    dot: 'bg-gray-400',
  };

  const hasPreOrder = order.items.some((i) => i.orderItemType === 'PRE_ORDER');
  const canCancel =
    hasPreOrder && !['CANCELLED', 'COMPLETED', 'REFUNDED', 'DELIVERED'].includes(order.orderStatus);

  const handleCancel = async () => {
    setCancelling(true);
    try {
      await profileApi.cancelOrder(order.orderId);
      queryClient.invalidateQueries({ queryKey: ['my-orders'] });
      setShowConfirm(false);
    } catch (e: unknown) {
      if (isAxiosError(e)) {
        alert(e.response?.data?.message ?? 'Lỗi khi hủy đơn hàng');
      } else if (e instanceof Error) {
        alert(e.message);
      } else {
        alert('Lỗi khi hủy đơn hàng');
      }
    } finally {
      setCancelling(false);
    }
  };

  const handleFeedbackClick = () => {
    if (order.orderStatus !== 'COMPLETED') return;
    
    // Gán tạm item đầu tiên nếu API cần productId
    setSelectedItem(order.items[0]); 
    setSelectedFeedback(orderFeedback);
    setFeedbackModalOpen(true);
  };

  const getProductId = (item: OrderItem) => {
    return item?.productId || '';
  };

  return (
    <div
      className={`border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow duration-200 ${order.orderStatus === 'CANCELLED' ? 'opacity-90' : ''}`}
    >
      {/* Modal xác nhận hủy */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowConfirm(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
                <svg
                  className="w-5 h-5 text-rose-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                </svg>
              </div>
              <div>
                <p className="font-bold text-gray-900">Xác nhận hủy đơn?</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {order.orderName || `Đơn #${order.orderId.slice(0, 8).toUpperCase()}`}
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              Đơn hàng <span className="font-semibold text-violet-700">PRE_ORDER</span> sẽ chuyển
              sang <span className="font-semibold text-rose-600">Đã hủy</span>.
            </p>
            <div className="flex gap-3 pt-1">
              <button
                onClick={() => setShowConfirm(false)}
                disabled={cancelling}
                className="flex-1 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors disabled:opacity-50"
              >
                Không hủy
              </button>
              <button
                onClick={handleCancel}
                disabled={cancelling}
                className="flex-1 py-2.5 text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {cancelling && (
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                )}
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header row – click to expand */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
            <svg
              className="w-4.5 h-4.5 text-indigo-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-semibold text-gray-800 text-sm">
                {order.orderName || `Đơn #${order.orderId.slice(0, 8).toUpperCase()}`}
              </p>
            </div>
            <p className="text-xs text-gray-400 truncate max-w-xs mt-0.5">
              {order.deliveryAddress}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 ml-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium border hidden sm:flex items-center gap-1.5 ${statusCfg.color}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />
            {statusCfg.label}
          </span>
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-gray-800 text-sm">
              {fmt(order.finalTotalAfterRefund)}
            </span>
            <svg
              className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </button>

      {expanded && (
        <div className="border-t border-gray-100 px-5 py-4 bg-gray-50/40 space-y-4">
          <div className="space-y-3">
            {order.items.map((item, idx) => (
              <OrderItemCard
                key={item.orderItemId}
                item={item}
                index={idx}
                total={order.items.length}
                orderName={order.orderName}
                orderId={order.orderId}
                orderStatus={order.orderStatus}
              />
            ))}
          </div>

          <div className={`rounded-2xl px-5 py-4 ${order.orderStatus === 'AWAITING_FINAL_PAYMENT' ? 'bg-indigo-50/50 border border-indigo-100 shadow-sm' : 'bg-white border border-gray-100'}`}>
            <div className="flex justify-between items-center">
              <span className={`text-sm font-medium ${order.orderStatus === 'AWAITING_FINAL_PAYMENT' ? 'text-indigo-900' : 'text-gray-600'}`}>
                {order.orderStatus === 'AWAITING_FINAL_PAYMENT' ? 'Tổng tiền cần thanh toán' : 'Còn phải trả'}
              </span>
              
              {order.orderStatus === 'CANCELLED' || order.orderStatus === 'REFUNDED' ? (
                <span className="text-lg font-bold text-gray-400">0 ₫</span>
              ) : order.remainingAmount <= 0 ? (
                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">Đã thanh toán đủ ✓</span>
              ) : (
                <span className="text-xl font-black text-rose-600 tracking-tight">
                  {fmt(order.remainingAmount)}
                </span>
              )}
            </div>

            {order.orderStatus === 'AWAITING_FINAL_PAYMENT' && (
              <div className="mt-4 pt-4 border-t border-indigo-100/50">
                <VnpayCheckoutButton 
                  orderId={order.orderId} 
                  className="w-full h-12 rounded-xl text-base shadow-indigo-200" 
                />
              </div>
            )}
          </div>

          {/* KHỐI FEEDBACK CHUNG CHO TOÀN ĐƠN HÀNG */}
          {order.orderStatus === 'COMPLETED' && (
            <div className="pt-2">
              {hasFeedback ? (
                <div className="bg-white border border-indigo-100 rounded-xl p-4">
                  <p className="text-xs font-bold text-indigo-600 mb-2 flex items-center gap-1">
                    <span className="w-1 h-3 bg-indigo-600 rounded-full" />
                    ĐÁNH GIÁ CỦA BẠN CHO ĐƠN HÀNG NÀY
                  </p>
                  <FeedbackPreview
                    feedback={orderFeedback}
                    onEdit={handleFeedbackClick}
                  />
                </div>
              ) : (
                <button
                  onClick={handleFeedbackClick}
                  className="w-full px-4 py-3 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100 flex items-center justify-center gap-2"
                >
                  Viết đánh giá cho đơn hàng
                </button>
              )}
            </div>
          )}

          {canCancel && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowConfirm(true);
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors"
            >
              Hủy đơn PRE_ORDER
            </button>
          )}
        </div>
      )}

      {/* Render FeedbackModal nếu đơn đã COMPLETED */}
      {order.orderStatus === 'COMPLETED' && (
        <FeedbackModal
          isOpen={feedbackModalOpen}
          onClose={() => setFeedbackModalOpen(false)}
          orderId={order.orderId}
          productId={selectedItem ? getProductId(selectedItem) : ''}
          existingFeedback={selectedFeedback}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ['my-feedbacks'] });
          }}
        />
      )}
    </div>
  );
}

// ─── MyOrders ─────────────────────────────────────────────────────────────────

export default function MyOrders() {
  const [activeTab, setActiveTab] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;
  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['my-feedbacks'] });
  }, [queryClient]);

  const { data: allFeedbacks } = useQuery({
    queryKey: ['my-feedbacks'],
    queryFn: async () => {
        try {
            const response = await profileApi.getMyFeedbacks();
            return response.data.result as BEFeedback[];
        } catch (error) {
            console.error("Error fetching all feedbacks:", error);
            return [];
        }
    },
    staleTime: 0,
  });

  const { data, isLoading, isError, refetch } = useMyOrders({ page: 0, size: 500 });

  const allOrders = data?.items || [];

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto p-6 space-y-4">
        <div className="h-8 w-48 bg-gray-200 rounded-lg animate-pulse mb-6"></div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-gray-100 rounded-2xl animate-pulse"></div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-3xl mx-auto p-12 flex flex-col items-center justify-center text-center bg-gray-50 rounded-3xl mt-6 border border-gray-100">
        <AlertCircle className="w-12 h-12 text-rose-400 mb-4" />
        <h3 className="text-lg font-bold text-gray-800">Không thể tải đơn hàng</h3>
        <p className="text-sm text-gray-500 mt-1 mb-6">Đã có lỗi xảy ra trong quá trình lấy dữ liệu.</p>
        <Button onClick={() => refetch()} variant="outline" className="gap-2">
          <RefreshCcw className="w-4 h-4" /> Thử lại
        </Button>
      </div>
    );
  }

  // Khối rỗng
  if (allOrders.length === 0) {
    return (
      <div className="max-w-3xl mx-auto p-12 flex flex-col items-center justify-center text-center bg-gray-50/50 rounded-3xl mt-6 border border-dashed border-gray-200">
        <div className="w-20 h-20 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mb-4">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h3 className="text-xl font-bold text-gray-800">Bạn chưa có đơn hàng nào</h3>
        <p className="text-sm text-gray-500 mt-2 mb-6 max-w-sm">
          Hãy khám phá các sản phẩm tuyệt vời của chúng tôi và đặt đơn hàng đầu tiên nhé.
        </p>
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl">
          Tiếp tục mua sắm
        </Button>
      </div>
    );
  }

  const countByStatus = (status: string) => allOrders.filter((o) => o.orderStatus === status).length;
  const filteredOrders = activeTab === 'ALL' ? allOrders : allOrders.filter((o) => o.orderStatus === activeTab);
  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / PAGE_SIZE));
  const paginated = filteredOrders.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const visibleStatuses = ['ALL', ...ALL_STATUSES.filter((s) => countByStatus(s) > 0)];

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setCurrentPage(1);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header & Filter Dropdown */}
      <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-100 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Đơn hàng của tôi</h1>
          <p className="text-sm text-gray-500 mt-1 flex items-center gap-1.5">
            <PackageOpen className="w-4 h-4" />
            Đang hiển thị {filteredOrders.length} đơn hàng
          </p>
        </div>

        <div className="w-full md:w-[260px]">
          <Select value={activeTab} onValueChange={handleTabChange}>
            <SelectTrigger className="w-full bg-gray-50/50 h-11 border-gray-200 focus:ring-indigo-500 rounded-xl transition-colors hover:bg-gray-50">
              <SelectValue placeholder="Chọn trạng thái">
                {activeTab === 'ALL' ? (
                   <span className="font-medium text-gray-800">Tất cả trạng thái</span>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${STATUS_CONFIG[activeTab]?.dot || 'bg-gray-400'}`} />
                    <span className="font-medium text-gray-800">{STATUS_CONFIG[activeTab]?.label}</span>
                  </div>
                )}
              </SelectValue>
            </SelectTrigger>
            
            <SelectContent className="rounded-xl border-gray-100 shadow-xl p-1">
              {visibleStatuses.map((status) => {
                const count = status === 'ALL' ? allOrders.length : countByStatus(status);
                
                if (status === 'ALL') {
                  return (
                    <SelectItem 
                      key={status} 
                      value={status}
                      className="cursor-pointer py-2.5 rounded-lg mb-1 focus:bg-gray-100"
                    >
                      <div className="flex items-center justify-between w-[200px]">
                        <span className="font-medium text-gray-700">Tất cả trạng thái</span>
                        <span className="text-[10px] font-bold text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full ml-3">
                          {count}
                        </span>
                      </div>
                    </SelectItem>
                  );
                }

                const cfg = STATUS_CONFIG[status];
                
                return (
                  <SelectItem 
                    key={status} 
                    value={status}
                    className={`cursor-pointer py-2 mb-1 rounded-lg focus:bg-transparent ${cfg?.color || 'bg-gray-50 text-gray-700'}`} 
                  >
                    <div className="flex items-center justify-between w-[200px]">
                      <div className="flex items-center gap-2">
                         <span className={`w-1.5 h-1.5 rounded-full ${cfg?.dot || 'bg-gray-400'}`} />
                         <span className="font-semibold text-sm">{cfg?.label}</span>
                      </div>
                      <span className="text-[10px] font-bold bg-white/60 px-2 py-0.5 rounded-full border border-black/5 ml-3">
                        {count}
                      </span>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
      </div>

      {paginated.length === 0 && activeTab !== 'ALL' && (
        <div className="py-12 text-center text-gray-500">
          Không có đơn hàng nào ở trạng thái <span className="font-semibold text-gray-700">{STATUS_CONFIG[activeTab]?.label}</span>.
        </div>
      )}

      {/* Danh sách đơn hàng */}
      <div className="space-y-4">
        {paginated.map((order, index) => (
          <div 
            key={order.orderId} 
            className="animate-in fade-in slide-in-from-bottom-2 fill-mode-both"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <OrderCard order={order} allFeedbacks={allFeedbacks || []} />
          </div>
        ))}
      </div>

      {/* Phân trang (Pagination) */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between mt-8 pt-6 border-t border-gray-100 gap-4">
          <p className="text-sm text-gray-500 font-medium">
            Hiển thị <span className="text-gray-900">{(currentPage - 1) * PAGE_SIZE + 1}</span>–
            <span className="text-gray-900">{Math.min(currentPage * PAGE_SIZE, filteredOrders.length)}</span> / {filteredOrders.length}
          </p>
          <div className="flex items-center gap-2 shadow-sm border border-gray-200 rounded-xl p-1 bg-white">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            <div className="flex items-center gap-1 px-2">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                const isActive = page === currentPage;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 text-sm font-semibold rounded-lg transition-all ${
                      isActive 
                        ? 'bg-indigo-600 text-white shadow-md' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}