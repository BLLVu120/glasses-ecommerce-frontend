import type { BEOrder } from '@/features/operation-staff/types/types';
import { Package, Truck, ArrowRight } from 'lucide-react';
import { useSidebar } from '@/features/shipper/hooks/useSidebar.ts';

interface Props {
  orders: BEOrder[];
  selectedIds: Set<string>;
  onToggle: (id: string) => void;
  onConfirm: () => void;
  onViewAccepted: () => void;
}

export function ScreenSelectOrders({
  orders,
  selectedIds,
  onToggle,
  onConfirm,
  onViewAccepted,
}: Props) {
  const count = selectedIds.size;
  const { collapsed } = useSidebar();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-primary px-4 py-4">
        <div className="flex items-center gap-3">
          <Package className="h-6 w-6 text-primary-foreground" />
          <h1 className="text-xl font-bold text-primary-foreground">Chọn đơn hàng</h1>
        </div>
        <p className="mt-1 text-sm text-primary-foreground/80">
          Đã chọn {count} / {orders.length} đơn
        </p>
      </header>

      {/* Navigation Button */}
      <div className="px-4 py-3">
        <button
          type="button"
          onClick={onViewAccepted}
          className="w-full rounded-xl bg-card border-2 border-border px-4 py-3 text-sm font-medium text-foreground hover:bg-accent hover:border-accent-foreground/20 active:bg-accent/90 transition-all duration-150"
        >
          <div className="flex items-center justify-center gap-2">
            <Truck className="h-4 w-4" />
            <span>Xem đơn hàng đã chấp nhận</span>
            <ArrowRight className="h-4 w-4" />
          </div>
        </button>
      </div>

      {/* Order list */}
      <main className="flex-1 px-4 py-3 pb-28 space-y-3">
        {orders.map((order) => {
          const checked = selectedIds.has(order.orderId);
          const codAmount = order.totalAmount - order.depositAmount;

          return (
            <button
              key={order.orderId}
              type="button"
              onClick={() => onToggle(order.orderId)}
              className={`w-full text-left rounded-lg border-2 p-4 transition-colors duration-150 ${
                checked ? 'border-primary bg-primary/5' : 'border-border bg-card'
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Custom checkbox */}
                <div
                  className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 transition-colors ${
                    checked ? 'border-primary bg-primary' : 'border-muted-foreground/40 bg-card'
                  }`}
                >
                  {checked && (
                    <svg
                      className="h-4 w-4 text-primary-foreground"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-foreground">Mã đơn: {order.orderId}</span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground truncate">
                    Người nhận: {order.recipientName}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground truncate">
                    Địa chỉ: {order.deliveryAddress}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">Số điện thoại: {order.phoneNumber}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Số lượng: {order.items.length} sản phẩm
                  </p>
                  {codAmount > 0 && (
                    <p className="mt-1 text-sm font-semibold text-foreground">
                        COD: {codAmount.toLocaleString('vi-VN')}₫
                    </p>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </main>

      {/* Sticky footer */}
      <div
        className={`fixed bottom-0 ${collapsed ? 'left-16' : 'left-64'} right-0 bg-card border-t border-border p-4 safe-bottom transition-all duration-300`}
      >
        <button
          type="button"
          onClick={onConfirm}
          disabled={count === 0}
          className={`w-full rounded-xl py-4 text-lg font-bold transition-colors duration-150 ${
            count > 0
              ? 'bg-primary text-primary-foreground active:bg-primary/90'
              : 'bg-muted text-muted-foreground cursor-not-allowed'
          }`}
        >
          Xác nhận lộ trình ({count} đơn)
        </button>
      </div>
    </div>
  );
}
