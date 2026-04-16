import { useEffect, useState } from 'react';
import type { BEOrder } from '@/features/operation-staff/types/types';
import { MapPin, Phone, StickyNote, Banknote, User, Package } from 'lucide-react';
import { useSidebar } from '@/features/shipper/hooks/useSidebar.ts';

interface Props {
  order: BEOrder;
  onBack: () => void;
  onComplete: () => void;
}

export function ScreenOrderDetail({ order, onBack, onComplete }: Props) {
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const codAmount = order?.totalAmount - order?.depositAmount;
  const { collapsed } = useSidebar();
  useEffect(() => {
  const fetchCoords = async () => {
    if (!order.deliveryAddress) return;

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(order.deliveryAddress)}&limit=1`,
        {
          headers: {
            'User-Agent': 'my-app (test@gmail.com)',
          },
        }
      );

      const data = await res.json();

      if (data && data.length > 0) {
        setCoords({
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  fetchCoords();
}, [order.deliveryAddress]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-primary px-4 py-4">
        <p className="text-sm text-primary-foreground/80">Đang giao</p>
        <h1 className="text-xl font-bold text-primary-foreground">Đơn {order.orderId}</h1>
      </header>

      {/* Content */}
      <main className="flex-1 px-4 py-4 pb-40 space-y-4">
        {/* Customer Info */}
        <div className="rounded-lg bg-card border border-border p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <User className="h-5 w-5" />
            <span className="text-sm font-medium">Khách hàng</span>
          </div>
          <p className="text-xl font-bold text-foreground">{order.recipientName}</p>
        </div>

        {/* Phone - MEGA */}
        <div className="rounded-lg bg-highlight border-2 border-primary/30 p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Phone className="h-5 w-5" />
            <span className="text-sm font-medium">Số điện thoại</span>
          </div>
          <a
            href={`tel:${order.phoneNumber.replace(/\s/g, '')}`}
            className="block text-2xl font-extrabold text-primary underline decoration-2"
          >
            {order.phoneNumber}
          </a>
        </div>

        {/* Address - MEGA */}
        <div className="rounded-lg bg-highlight border-2 border-primary/30 p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <MapPin className="h-5 w-5" />
            <span className="text-sm font-medium">Địa chỉ giao hàng</span>
          </div>
          <p className="text-2xl font-extrabold text-foreground leading-snug">
            {order.deliveryAddress}
          </p>
          {coords && (
  <div className="mt-3 overflow-hidden rounded-xl border border-gray-200">
    <iframe
      title="Map"
      width="100%"
      height="180"
      src={`https://www.openstreetmap.org/export/embed.html?bbox=${
        coords.lng - 0.003
      },${coords.lat - 0.003},${coords.lng + 0.003},${
        coords.lat + 0.003
      }&layer=mapnik&marker=${coords.lat},${coords.lng}`}
    />
  </div>
)}
        </div>

        {/* Order Items */}
        <div className="rounded-lg bg-card border border-border p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-3">
            <Package className="h-5 w-5" />
            <span className="text-sm font-medium">Sản phẩm ({order.items.length})</span>
          </div>
          <div className="space-y-2">
            {order.items.map((item) => (
              <div
                key={item.orderItemId}
                className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700 last:border-0"
              >
                <div>
                  <p className="font-medium text-foreground text-sm">{item?.lensName}</p>
                  <p className="text-xs text-muted-foreground">SL: {item?.quantity}</p>
                </div>
                <span className="text-sm font-medium text-foreground">
                  {item.totalPrice?.toLocaleString('vi-VN')}₫
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* COD */}
        <div className="rounded-lg bg-card border border-border p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Banknote className="h-5 w-5" />
            <span className="text-sm font-medium">Tiền thu hộ (COD)</span>
          </div>
          <p
            className={`text-2xl font-extrabold ${codAmount > 0 ? 'text-foreground' : 'text-muted-foreground'}`}
          >
            {codAmount > 0 ? `${codAmount?.toLocaleString('vi-VN')}₫` : 'Không thu tiền'}
          </p>
          <div className="mt-2 pt-2 border-t border-border">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tổng tiền:</span>
              <span>{order.totalAmount?.toLocaleString('vi-VN')}₫</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Đã cọc:</span>
              <span>-{order.depositAmount?.toLocaleString('vi-VN')}₫</span>
            </div>
          </div>
        </div>

        {/* Combo Info */}
        {order.comboName && (
          <div className="rounded-lg bg-card border border-border p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <StickyNote className="h-5 w-5" />
              <span className="text-sm font-medium">Combo</span>
            </div>
            <p className="text-base font-medium text-foreground">{order?.comboName}</p>
            {order?.comboDiscountAmount && (
              <p className="text-sm text-success">
                Giảm: {order.comboDiscountAmount?.toLocaleString('vi-VN')}₫
              </p>
            )}
          </div>
        )}
      </main>

      {/* Sticky footer buttons */}
      <div
        className={`fixed bottom-0 ${collapsed ? 'left-16' : 'left-64'} right-0 bg-card border-t border-border p-4 space-y-3 safe-bottom transition-all duration-300`}
      >
        <button
          type="button"
          onClick={onComplete}
          className="w-full rounded-xl bg-success py-5 text-xl font-bold text-success-foreground active:bg-success/90 transition-colors"
        >
          ✅ Đã giao xong
        </button>
        <button
          type="button"
          onClick={onBack}
          className="w-full rounded-xl bg-muted py-4 text-base font-semibold text-muted-foreground active:bg-muted/80 transition-colors"
        >
          ← Quay lại
        </button>
      </div>
    </div>
  );
}
