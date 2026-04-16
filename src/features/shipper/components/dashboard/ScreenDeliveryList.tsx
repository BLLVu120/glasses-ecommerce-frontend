import type { BEOrder } from '@/features/operation-staff/types/types';
import { ArrowLeft, CheckCircle2, Truck, Clock } from 'lucide-react';
import { useShipperStore } from '@/features/shipper/store/shipperStore';

interface Props {
  orders: BEOrder[];
  completedIds: Set<string>;
  startedIds: Set<string>;
  onStart: (id: string) => void;
  onBack: () => void;
}

export function ScreenDeliveryList({ orders, completedIds, onStart, onBack }: Props) {
  const doneCount = orders.filter((o) => completedIds.has(o.orderId)).length;
  const loading = useShipperStore((state) => state.loading);
  const hasDeliveringOrder = orders?.some((order) => order.orderStatus === 'DELIVERING');

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-primary px-4 py-4">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-primary-foreground/80 mb-2"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="text-sm font-medium">Quay lại chọn đơn</span>
        </button>
        <div className="flex items-center gap-3">
          <Truck className="h-6 w-6 text-primary-foreground" />
          <h1 className="text-xl font-bold text-primary-foreground">Lộ trình giao hàng</h1>
        </div>
        <p className="mt-1 text-sm text-primary-foreground/80">
          Hoàn thành {doneCount} / {orders.length} đơn
        </p>
      </header>

      {/* Order cards */}
      <main className="flex-1 px-4 py-3 space-y-3 pb-6">
        {orders.map((order) => {
          const done = order.orderStatus === 'COMPLETED';
          const started = order.orderStatus === 'DELIVERING';
          const codAmount = order.totalAmount - order.depositAmount;

          return (
            <div
              key={order.orderId}
              className={`rounded-lg border p-4 transition-colors duration-150 ${
                done ? 'bg-muted border-border' : 'bg-card border-border'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {done && <CheckCircle2 className="h-5 w-5 text-success shrink-0" />}
                    {started && <Clock className="h-5 w-5 text-primary shrink-0" />}
                    <span
                      className={`font-semibold ${
                        done ? 'line-through text-muted-foreground' : 'text-foreground'
                      }`}
                    >
                      Mã đơn: {order.orderId}
                    </span>
                  </div>
                  <p
                      className={`mt-1 text-sm ${
                          done ? 'line-through text-muted-foreground' : 'text-muted-foreground'
                      }`}
                  >
                    Người nhận: {order.recipientName}
                  </p>
                  <p
                    className={`mt-1 text-sm ${
                      done ? 'line-through text-muted-foreground' : 'text-muted-foreground'
                    }`}
                  >
                    Địa chỉ: {order.deliveryAddress}
                  </p>
                  <p
                    className={`mt-1 text-sm ${
                      done ? 'line-through text-muted-foreground' : 'text-muted-foreground'
                    }`}
                  >
                    Số điện thoại: {order.phoneNumber}
                  </p>
                  {codAmount > 0 && (
                    <p
                      className={`mt-1 text-sm font-semibold ${
                        done ? 'line-through text-muted-foreground' : 'text-foreground'
                      }`}
                    >
                      COD: {codAmount.toLocaleString('vi-VN')}₫
                    </p>
                  )}
                </div>

                {done && (
                  <span className="shrink-0 rounded-xl bg-success/15 px-5 py-3 text-base font-bold text-success">
                    Đã xong ✓
                  </span>
                )}
                {started && (
                  <button
                    type="button"
                    onClick={() => onStart(order.orderId)}
                    className="shrink-0 rounded-xl bg-primary/15 border-2 border-primary px-5 py-3 text-base font-bold text-primary active:bg-primary/25 transition-colors"
                  >
                    Đã bắt đầu →
                  </button>
                )}
                {!done && !started && (
                  <button
                    type="button"
                    onClick={() => onStart(order.orderId)}
                    disabled={loading || hasDeliveringOrder}
                    className={`shrink-0 rounded-xl px-6 py-3 text-base font-bold transition-colors ${
                      loading || hasDeliveringOrder
                        ? 'bg-muted text-muted-foreground cursor-not-allowed opacity-50'
                        : 'bg-primary text-primary-foreground active:bg-primary/90'
                    }`}
                  >
                    {hasDeliveringOrder
                      ? 'Đang giao đơn khác'
                      : loading
                        ? 'Đang xử lý...'
                        : 'Bắt đầu'}
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {doneCount === orders.length && orders.length > 0 && (
          <div className="mt-6 rounded-xl bg-success/10 border border-success/30 p-6 text-center">
            <CheckCircle2 className="h-12 w-12 text-success mx-auto mb-3" />
            <p className="text-lg font-bold text-foreground">Hoàn thành tất cả đơn hàng! 🎉</p>
          </div>
        )}
      </main>
    </div>
  );
}
