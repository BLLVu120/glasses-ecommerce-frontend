import { useEffect, useState } from 'react';
import { useCheckoutStore } from '../store/useCheckoutStore';
import {
  MapPin,
  CreditCard,
  Truck,
  Phone,
  CalendarDays,
  Wallet,
  Map as MapIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const ReviewOrder = ({ onEdit }: { onEdit: (step: number) => void }) => {
  const { shippingData, paymentMethod } = useCheckoutStore();

  // State lưu tọa độ để vẽ bản đồ
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

  // Tự động tìm tọa độ khi màn hình Review được bật lên
  useEffect(() => {
    const fetchCoordinates = async () => {
      if (!shippingData.address) return;
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(shippingData.address)}&limit=1`,
        );
        const data = await response.json();

        if (data && data.length > 0) {
          setCoords({ lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) });
        }
      } catch (error) {
        console.error('Lỗi khi load bản đồ xác nhận:', error);
      }
    };

    fetchCoordinates();
  }, [shippingData.address]);

  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-bottom-6 duration-700">
      {/* --- BLOCK 1: THÔNG TIN GIAO HÀNG --- */}
      <Card className="shadow-sm border-gray-200 overflow-hidden bg-white">
        <CardHeader className="flex flex-row items-center justify-between px-5 bg-gray-50/80 border-b border-gray-100">
          <CardTitle className="text-sm font-bold flex items-center gap-2.5 text-gray-800">
            <div className="p-1.5 bg-[#4A8795]/10 text-[#4A8795] rounded-md">
              <MapPin className="w-4 h-4" />
            </div>
            Thông tin giao hàng
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(1)}
            className="text-[#4A8795] hover:bg-[#4A8795]/10 h-8 px-3 text-xs font-bold uppercase tracking-wider"
          >
            Sửa
          </Button>
        </CardHeader>

        <CardContent className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* CỘT 1: ĐỊA CHỈ */}
            <div className="flex flex-col gap-1.5">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                Giao đến
              </p>
              <div className="pt-0.5">
                <div className="text-gray-900 text-[15px] leading-snug font-medium">
                  <p>{shippingData.address || 'Chưa cung cấp địa chỉ nhận hàng'}</p>
                </div>
              </div>
            </div>

            {/* CỘT 2: LIÊN HỆ */}
            <div className="flex flex-col gap-1.5">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                Số điện thoại liên hệ
              </p>
              <div className="grid gap-2.5 pt-0.5">
                <div className="flex items-center gap-3 p-2.5 rounded-md bg-gray-50 border border-gray-100 group hover:border-gray-200 transition-colors">
                  <Phone className="w-4 h-4 text-gray-400 group-hover:text-[#4A8795]" />
                  <span className="text-sm font-semibold text-gray-700">
                    {shippingData.phone || 'Chưa cung cấp số điện thoại'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* BẢN ĐỒ MINI XUẤT HIỆN Ở ĐÂY */}
          {coords && (
            <div className="mt-5 overflow-hidden rounded-xl border border-gray-200 shadow-sm animate-in fade-in duration-500">
              <div className="bg-gray-50 px-3 py-2 border-b border-gray-200 flex items-center gap-2">
                <MapIcon className="w-4 h-4 text-[#4A8795]" />
                <span className="text-xs font-semibold text-gray-600">Vị trí trên bản đồ</span>
              </div>
              <iframe
                title="Review Map"
                width="100%"
                height="160"
                frameBorder="0"
                scrolling="no"
                marginHeight={0}
                marginWidth={0}
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${coords.lng - 0.005},${coords.lat - 0.005},${coords.lng + 0.005},${coords.lat + 0.005}&layer=mapnik&marker=${coords.lat},${coords.lng}`}
                className="w-full grayscale-[20%] hover:grayscale-0 transition-all duration-500"
              ></iframe>
            </div>
          )}
        </CardContent>
      </Card>

      {/* --- BLOCK 2: THANH TOÁN & VẬN CHUYỂN --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Phương thức thanh toán */}
        <Card className="shadow-sm border-gray-200 flex flex-col h-full bg-white">
          <CardHeader className="flex flex-row items-center justify-between py-3 px-5 border-b border-gray-100 bg-gray-50/30">
            <CardTitle className="text-sm font-bold flex items-center gap-2 text-gray-800">
              <CreditCard className="w-4 h-4 text-[#4A8795]" /> Thanh toán
            </CardTitle>
            <Button
              variant="link"
              size="sm"
              onClick={() => onEdit(2)}
              className="text-[#4A8795] p-0 h-auto text-[11px] font-bold uppercase"
            >
              Thay đổi
            </Button>
          </CardHeader>
          <CardContent className="p-5 flex items-center h-full">
            {paymentMethod === 'VNPAY' ? (
              <div className="flex items-center gap-4">
                <div className="w-[60px] h-[38px] bg-blue-50 rounded-md flex items-center justify-center shrink-0 border border-blue-100">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-[15px]">Cổng thanh toán VNPay</p>
                  <p className="text-xs text-gray-500 font-medium mt-0.5">
                    Thanh toán qua QR, Thẻ ATM/Visa
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <div className="w-[60px] h-[38px] bg-orange-50 rounded-md flex items-center justify-center shrink-0 border border-orange-100">
                  <Wallet className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-[15px]">Thanh toán tiền mặt</p>
                  <p className="text-xs text-gray-500 font-medium mt-0.5">
                    Thanh toán khi nhận hàng (COD)
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Phương thức vận chuyển */}
        <Card className="shadow-sm border-gray-200 flex flex-col h-full bg-white">
          <CardHeader className="flex flex-row items-center justify-between py-3 px-5 border-b border-gray-100 bg-gray-50/30">
            <CardTitle className="text-sm font-bold flex items-center gap-2 text-gray-800">
              <Truck className="w-4 h-4 text-[#4A8795]" /> Vận chuyển
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 flex items-center h-full">
            <div className="flex items-center gap-4">
              <div className="w-[60px] h-[38px] bg-green-50 rounded-md flex items-center justify-center shrink-0 border border-green-100">
                <CalendarDays className="w-5 h-5 text-green-700" />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-[15px]">Giao hàng tiêu chuẩn</p>
                <p className="text-xs text-gray-500 mt-0.5 font-medium">
                  Dự kiến 3 - 5 ngày làm việc
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
