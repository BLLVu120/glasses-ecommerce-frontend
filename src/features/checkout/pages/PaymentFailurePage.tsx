import { XCircle, RefreshCw, HelpCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export const PaymentFailurePage = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50/50 p-4">
      <Card className="max-w-md w-full bg-white shadow-lg border-0 rounded-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="p-8 text-center">
          {/* 1. Icon Cảnh báo - Màu đỏ/cam nhưng không quá gắt */}
          <div className="mx-auto mb-6 w-20 h-20 bg-red-50 rounded-full flex items-center justify-center">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center text-red-600 shadow-sm">
              <XCircle className="w-8 h-8" strokeWidth={3} />
            </div>
          </div>

          {/* 2. Thông báo lỗi - Trực diện */}
          <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Thanh toán thất bại</h1>
          <p className="text-gray-500 mb-6">
            Chúng tôi không thể xử lý khoản thanh toán của bạn. Đừng lo lắng, bạn chưa bị trừ tiền.
          </p>

          {/* 3. Lý do lỗi (Rất quan trọng về UX) */}
          <div className="bg-red-50/50 rounded-xl p-4 mb-8 border border-red-100 flex items-start gap-3 text-left">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-gray-900">Lỗi: Số dư không đủ</h4>
              <p className="text-xs text-gray-600 mt-1">
                Thẻ của bạn đã bị ngân hàng từ chối. Vui lòng đảm bảo tài khoản của bạn có đủ số dư hoặc thử một thẻ khác.
              </p>
            </div>
          </div>

          {/* 4. Các nút điều hướng - Ưu tiên nút "Thử lại" */}
          <div className="space-y-3">
            <Button className="w-full h-11 bg-gray-900 hover:bg-black font-bold shadow-md gap-2">
              <RefreshCw className="w-4 h-4" /> Thử thanh toán lại
            </Button>

            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="w-full font-semibold border-gray-200">
                Đổi phương thức
              </Button>
              <Button variant="ghost" className="w-full font-semibold text-gray-600">
                <HelpCircle className="w-4 h-4 mr-2" /> Trợ giúp
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};