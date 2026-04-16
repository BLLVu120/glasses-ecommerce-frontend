// ─── src/components/refund/RefundDetailModal.tsx ─────────────────────────────

import type { RefundItem } from '../../types/refund'; // Điều chỉnh lại đường dẫn nếu cần
import { fmt, getProductName } from '@/lib/utils'; // Điều chỉnh lại đường dẫn nếu cần
import { toast } from 'sonner'; // Import sonner
import { useCheckoutRefund } from '../../hooks/useRefunds'; // Import hook TanStack

interface RefundDetailModalProps {
  refund: RefundItem;
  onClose: () => void;
  // Bỏ onCheckout đi vì modal sẽ tự xử lý
  // onCheckout: (id: string) => Promise<string | null>;
}

export function RefundDetailModal({ refund, onClose }: RefundDetailModalProps) {
  // Sử dụng mutation từ TanStack Query
  const { mutateAsync: checkoutRefund, isPending: isCheckingOut } = useCheckoutRefund();

  // Nếu không có order thì không render gì cả hoặc báo lỗi (safety check)
  if (!refund.order) return null;

  const order = refund.order;

  const handleCheckout = async () => {
    try {
      // Gọi mutation checkoutRefund
      const paymentUrl = await checkoutRefund(refund.refundId);

      toast.success('Đang chuyển hướng đến cổng thanh toán...');

      // Kiểm tra xem API có trả về URL hợp lệ không (chứa http/https)
      if (paymentUrl && paymentUrl.startsWith('http')) {
        // Redirect người dùng sang trang thanh toán VNPAY
        window.location.href = paymentUrl;
      } else {
        // Nếu không có URL hoặc trả về null (thanh toán nội bộ/loại khác), thì đóng modal
        toast.success('Xác nhận hoàn tiền thành công!');
        onClose();
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Lỗi xác nhận hoàn tiền';
      toast.error(message);
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md">
        {/* header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-widest">Chi tiết hoàn tiền</p>
            <p className="text-sm font-bold text-gray-800 mt-0.5 font-mono">
              #{(refund.refundId ?? '').slice(0, 8)}...
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400">
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* body */}
        <div className="px-6 py-5 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            {(
              [
                ['Sản phẩm', getProductName(order) ?? '—'],
                ['Mã đơn hàng', `#${(order.orderId ?? '').slice(0, 8)}...`],
                ['SĐT khách', order.phoneNumber || '—'],
                ['Số tiền hoàn', fmt(order.paidAmount)],
                ['Đặt cọc', fmt(order.depositAmount)],
                ['Trạng thái đơn', order.orderStatus ?? '—'],
              ] as [string, string][]
            ).map(([k, v]) => (
              <div key={k} className="bg-gray-50 rounded-xl px-3 py-2.5">
                <p className="text-[10px] text-gray-400 uppercase tracking-wide">{k}</p>
                <p className="text-sm font-semibold text-gray-800 mt-0.5 truncate">{v}</p>
              </div>
            ))}
          </div>

          <div className="bg-gray-50 rounded-xl px-3 py-2.5">
            <p className="text-[10px] text-gray-400 uppercase tracking-wide">Địa chỉ giao hàng</p>
            <p className="text-sm font-semibold text-gray-800 mt-0.5">
              {order.deliveryAddress || '—'}
            </p>
          </div>

          {order.bankInfo?.bankName && (
            <div className="bg-blue-50 border border-blue-100 rounded-xl px-3 py-2.5">
              <p className="text-[10px] text-blue-600 uppercase tracking-wide font-semibold mb-1">
                Thông tin hoàn tiền
              </p>
              <p className="text-sm text-gray-700">
                <span className="text-gray-400">Ngân hàng:</span>{' '}
                <span className="font-medium">{order.bankInfo.bankName}</span>
              </p>
              <p className="text-sm text-gray-700">
                <span className="text-gray-400">STK:</span>{' '}
                <span className="font-medium">{order.bankInfo.bankAccountNumber}</span>
              </p>
              <p className="text-sm text-gray-700">
                <span className="text-gray-400">Chủ TK:</span>{' '}
                <span className="font-medium">{order.bankInfo.accountHolderName}</span>
              </p>
            </div>
          )}
        </div>

        {/* footer */}
        <div className="px-6 pb-5 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
          >
            Đóng
          </button>
          <button
            onClick={handleCheckout}
            disabled={isCheckingOut}
            className="flex-1 py-2.5 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {isCheckingOut && (
              <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            )}
            ✓ Xác nhận hoàn tiền
          </button>
        </div>
      </div>
    </div>
  );
}
