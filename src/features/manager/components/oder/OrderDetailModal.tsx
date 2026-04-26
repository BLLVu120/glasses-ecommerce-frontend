import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

import {
  User,
  Phone,
  MapPin,
  Receipt,
  Calendar,
  Package,
  Glasses,
  Info,
  ClipboardList,
  FileText,
  ImageIcon,
} from 'lucide-react';
import {
  STATUS_CONFIG,
  type Order,
  type OrderItem,
  type Prescription,
} from '../../types/order-type';
import { fmt } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

// ─── SUB-COMPONENT: ĐIỂM SỐ ĐO MẮT ───────────────────────────
function PrescriptionPoint({
  label,
  sph,
  cyl,
  axis,
}: {
  label: string;
  sph: number;
  cyl: number;
  axis: number;
}) {
  return (
    <div className="space-y-0.5">
      <p className="text-[9px] font-black text-blue-600 uppercase tracking-tighter">{label}</p>
      <p className="text-xs font-bold text-slate-800">
        S: {sph > 0 ? `+${sph}` : sph} | C: {cyl} | A: {axis}°
      </p>
    </div>
  );
}

// ─── SUB-COMPONENT: HIỂN THỊ ĐƠN THUỐC (DATA + IMAGE) ────────
function PrescriptionDisplay({ prescription }: { prescription: Prescription }) {
  const hasData = prescription.odSphere !== 0 || prescription.osSphere !== 0;
  const hasImage = !!prescription.imageUrl;

  return (
    <div className="mt-4 pt-4 border-t border-dashed border-slate-200">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400">
          <FileText size={12} /> Thông số đơn thuốc
        </div>

        {hasImage && (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-[10px] font-bold text-blue-600 hover:text-blue-700 hover:bg-blue-50 gap-1.5 rounded-lg"
              >
                <ImageIcon size={12} /> Xem ảnh đơn thuốc
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-1 border-none shadow-2xl rounded-2xl overflow-hidden bg-white">
              <img
                src={prescription.imageUrl!}
                alt="Prescription"
                className="w-full h-auto object-contain max-h-[400px]"
              />
              <div className="p-2 bg-slate-50 text-[10px] font-bold text-center text-slate-500 uppercase">
                Ảnh đơn thuốc gốc của khách hàng
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>

      {hasData ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50/80 p-3 rounded-xl border border-slate-100">
          <PrescriptionPoint
            label="Mắt Phải (OD)"
            sph={prescription.odSphere}
            cyl={prescription.odCylinder}
            axis={prescription.odAxis}
          />
          <PrescriptionPoint
            label="Mắt Trái (OS)"
            sph={prescription.osSphere}
            cyl={prescription.osCylinder}
            axis={prescription.osAxis}
          />
          <div className="space-y-0.5">
            <p className="text-[9px] font-black text-slate-400 uppercase">ADD / PD</p>
            <p className="text-xs font-bold text-slate-700">
              {prescription.odAdd || 0} / {prescription.odPd || 0}
            </p>
          </div>
          <div className="space-y-0.5">
            <p className="text-[9px] font-black text-slate-400 uppercase">Ghi chú</p>
            <p className="text-[10px] font-medium text-slate-600 truncate">
              {prescription.note || '---'}
            </p>
          </div>
        </div>
      ) : (
        !hasImage && (
          <p className="text-[10px] text-slate-400 italic font-medium">
            Không có thông số đo mắt trực tiếp
          </p>
        )
      )}
    </div>
  );
}

// ─── SUB-COMPONENT: DÒNG SẢN PHẨM ───────────────────────────
function ProductItemRow({ item }: { item: OrderItem }) {
  return (
    <div className="group bg-white border rounded-[1.5rem] p-4 hover:border-blue-200 hover:shadow-md transition-all">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Thumbnail & Info */}
        <div className="flex flex-1 gap-4">
          <div className="w-16 h-16 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 border overflow-hidden">
            {item.productImage ? (
              <img src={item.productImage} alt="Product" className="w-full h-full object-cover" />
            ) : (
              <Glasses className="text-slate-300" />
            )}
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-slate-900 text-sm leading-tight">
              {item.productName || item.itemName}
            </h4>
            <div className="flex flex-wrap gap-2">
              <Badge
                variant="outline"
                className="text-[10px] px-2 py-0 border-slate-200 text-slate-500 font-bold uppercase"
              >
                {item.variantName || 'Mặc định'}
              </Badge>
              <Badge
                variant="outline"
                className="text-[10px] px-2 py-0 border-blue-100 text-blue-600 bg-blue-50/50 font-bold uppercase"
              >
                SL: {item.quantity}
              </Badge>
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="md:text-right flex flex-col justify-center min-w-[140px]">
          <p className="text-sm font-black text-slate-900">{fmt(item.totalPrice)}</p>
          {item.lensName && (
            <p className="text-[10px] font-bold text-blue-500 uppercase flex items-center md:justify-end gap-1 mt-0.5">
              <Info size={10} /> {item.lensName}
            </p>
          )}
        </div>
      </div>

      {item.prescription && <PrescriptionDisplay prescription={item.prescription} />}
    </div>
  );
}

// ─── MAIN COMPONENT: MODAL CHI TIẾT ĐƠN HÀNG ────────────────
export function OrderDetailModal({ order, onClose, extraFooter }: { order: Order; onClose: () => void; extraFooter?: React.ReactNode }) {
  const statusInfo = STATUS_CONFIG[order.orderStatus] || {
    label: order.orderStatus,
    className: 'bg-slate-100',
  };

  return (
    <Dialog open={!!order} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[850px] p-0 overflow-hidden border-none rounded-[2.5rem] shadow-2xl">
        {/* Header Section */}
        <div className="bg-slate-50/80 px-8 py-6 border-b shrink-0">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <Badge
                className={`${statusInfo.className} px-4 py-1 rounded-full uppercase text-[10px] font-black tracking-widest`}
              >
                {statusInfo.label}
              </Badge>
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                  Mã đơn hàng
                </span>
                <span className="text-xs font-mono text-slate-500 font-bold">#{order.orderId}</span>
              </div>
            </div>
            <DialogTitle className="text-2xl font-black text-slate-900 mt-2 flex items-center gap-2">
              <ClipboardList className="text-blue-600" size={28} /> Chi tiết đơn hàng
            </DialogTitle>
          </DialogHeader>
        </div>

        {/* Content Section */}
        <ScrollArea className="max-h-[75vh]">
          <div className="p-8 space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Cột 1: Thông tin khách hàng */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-slate-900 font-black uppercase tracking-widest text-[11px]">
                  <User size={16} className="text-blue-600" /> Khách hàng
                </div>
                <div className="bg-white border rounded-[1.5rem] p-5 space-y-3 shadow-sm">
                  <p className="text-slate-900 font-black text-base">
                    {order.recipientName || 'Ẩn danh'}
                  </p>
                  <div className="space-y-2">
                    <p className="text-sm flex items-center gap-2 text-slate-500 font-medium">
                      <Phone size={14} className="text-slate-300" /> {order.phoneNumber}
                    </p>
                    <p className="text-sm flex items-start gap-2 text-slate-500 font-medium leading-relaxed">
                      <MapPin size={14} className="text-slate-300 shrink-0 mt-1" />{' '}
                      {order.deliveryAddress}
                    </p>
                  </div>
                </div>
              </div>

              {/* Cột 2: Tài chính */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-slate-900 font-black uppercase tracking-widest text-[11px]">
                  <Receipt size={16} className="text-blue-600" /> Tài chính
                </div>
                <Card className="bg-slate-900 text-white border-none shadow-xl rounded-[1.5rem] overflow-hidden">
                  <CardContent className="p-5 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-slate-400 font-black uppercase">
                        Tổng giá trị
                      </span>
                      <span className="font-bold">{fmt(order.totalAmount)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-emerald-400 font-black uppercase">
                        Đã thanh toán
                      </span>
                      <span className="text-emerald-400 font-bold">-{fmt(order.paidAmount)}</span>
                    </div>
                    <Separator className="bg-white/10" />
                    <div className="flex justify-between items-center pt-1">
                      <span className="text-[10px] font-black uppercase text-blue-400 tracking-widest">
                        Cần thu thêm
                      </span>
                      <span className="text-2xl font-black text-blue-400">
                        {fmt(order.remainingAmount || 0)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Row: Danh sách sản phẩm */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-900 font-black uppercase tracking-widest text-[11px]">
                  <Package size={16} className="text-blue-600" /> Danh mục sản phẩm
                </div>
                <Badge variant="secondary" className="rounded-lg font-bold">
                  {order.items.length} món
                </Badge>
              </div>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <ProductItemRow key={item.orderItemId} item={item} />
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Footer Section */}
        <DialogFooter className="bg-slate-50/80 px-8 py-5 border-t shrink-0">
          {extraFooter ? (
            <div className="w-full">{extraFooter}</div>
          ) : (
            <div className="flex items-center justify-between w-full">
              <div className="hidden md:flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                <Calendar size={14} /> Dữ liệu thời gian thực
              </div>
              <Button
                onClick={onClose}
                className="rounded-xl font-black px-10 bg-slate-900 hover:bg-blue-700 transition-all uppercase text-xs tracking-widest h-11"
              >
                Đóng cửa sổ
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
