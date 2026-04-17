import { Link } from 'react-router-dom';
import { Check, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useOrderSuccess } from '../store/useOrderSuccess';

export const PaymentSuccessPage = () => {
  const { orderId, email, deliveryDate, isLoading, orderData } = useOrderSuccess();

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4 animate-in fade-in duration-500">
      <Card className="max-w-lg w-full bg-white shadow-none border-0 sm:border sm:shadow-lg sm:rounded-2xl overflow-hidden relative">
        {/* Lớp phủ Loading khi đang gọi API */}
        {isLoading && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center z-50">
            <Loader2 className="w-8 h-8 animate-spin text-[#1e2575]" />
          </div>
        )}

        <div className="p-8 md:p-12 text-center">
          <div className="mx-auto mb-8 w-24 h-24 bg-green-50 rounded-full flex items-center justify-center animate-in zoom-in duration-300">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center shadow-sm text-green-600">
              <Check className="w-10 h-10" strokeWidth={4} />
            </div>
          </div>

          <h1 className="text-3xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Đặt hàng thành công!
          </h1>

          <p className="text-gray-500 mb-8 leading-relaxed max-w-sm mx-auto">
            Cảm ơn{' '}
            {orderData?.recipientName ? (
              <span className="font-semibold text-gray-900">{orderData.recipientName}</span>
            ) : (
              'bạn'
            )}{' '}
            đã mua sắm. Chúng tôi đã gửi biên lai đến{' '}
            <span className="font-semibold text-gray-900">{email}</span>.
          </p>

          <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left grid grid-cols-2 gap-6">
            <div>
              <span className="block text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-1">
                Mã đơn hàng
              </span>
              <span className="block text-sm font-bold text-gray-900 font-mono">{orderId}</span>
            </div>
            <div className="text-right">
              <span className="block text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-1">
                Dự kiến giao
              </span>
              <span className="block text-sm font-bold text-gray-900">{deliveryDate}</span>
            </div>

            {/* Thêm phần hiển thị Tổng tiền (Định dạng VNĐ) */}
            {orderData?.totalAmount !== undefined && (
              <div className="col-span-2 pt-4 border-t border-gray-200 flex justify-between items-center">
                <span className="text-xs font-extrabold text-gray-400 uppercase tracking-widest">
                  Tổng thanh toán
                </span>
                <span className="text-lg font-extrabold text-[#1e2575]">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                    orderData.totalAmount,
                  )}
                </span>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {/* Đã bọc Link trỏ về trang Quản lý đơn hàng cá nhân */}
            <Link to="/profile/orders" className="block">
              <Button className="w-full h-12 text-base bg-[#1e2575] hover:bg-[#151b5e] font-bold shadow-md transition-all">
                Xem chi tiết đơn hàng <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>

            {/* Đổi link sang /shop để dẫn thẳng vào trang danh sách sản phẩm */}
            <Link to="/shop" className="block">
              <Button
                variant="ghost"
                className="w-full h-12 text-base font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              >
                Tiếp tục mua sắm
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
};