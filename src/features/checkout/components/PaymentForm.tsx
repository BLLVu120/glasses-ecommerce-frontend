import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useCheckoutStore } from '../store/useCheckoutStore';
import { CheckCircle2, CreditCard, Truck, Landmark } from 'lucide-react';

export const PaymentForm = () => {
  const { paymentMethod, setPaymentMethod, bankInfo, updateBankInfo } = useCheckoutStore();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          Phương thức thanh toán
        </h2>

        <RadioGroup
          value={paymentMethod}
          onValueChange={setPaymentMethod}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          {/* LỰA CHỌN VNPAY */}
          <div>
            <RadioGroupItem value="VNPAY" id="vnpay" className="peer sr-only" />
            <Label
              htmlFor="vnpay"
              className="relative flex flex-col items-center justify-between rounded-2xl border-2 border-muted bg-white p-6 hover:bg-blue-50/50 peer-data-[state=checked]:border-[#4A8795] peer-data-[state=checked]:bg-blue-50/30 cursor-pointer transition-all h-full"
            >
              {paymentMethod === 'VNPAY' && (
                <CheckCircle2 className="absolute top-3 right-3 w-5 h-5 text-[#4A8795]" />
              )}
              <div className="p-3 bg-blue-100 rounded-full mb-3">
                <CreditCard className="h-6 w-6 text-blue-600" />
              </div>
              <span className="font-bold text-gray-900">VNPay</span>
              <span className="text-[10px] text-gray-500 mt-1 text-center">
                Thanh toán qua QR, Thẻ ATM/Nội địa
              </span>
            </Label>
          </div>

          {/* LỰA CHỌN COD */}
          <div>
            <RadioGroupItem value="COD" id="cod" className="peer sr-only" />
            <Label
              htmlFor="cod"
              className="relative flex flex-col items-center justify-between rounded-2xl border-2 border-muted bg-white p-6 hover:bg-orange-50/50 peer-data-[state=checked]:border-[#4A8795] peer-data-[state=checked]:bg-orange-50/30 cursor-pointer transition-all h-full"
            >
              {paymentMethod === 'COD' && (
                <CheckCircle2 className="absolute top-3 right-3 w-5 h-5 text-[#4A8795]" />
              )}
              <div className="p-3 bg-orange-100 rounded-full mb-3">
                <Truck className="h-6 w-6 text-orange-600" />
              </div>
              <span className="font-bold text-gray-900">COD</span>
              <span className="text-[10px] text-gray-500 mt-1 text-center">
                Thanh toán khi nhận hàng
              </span>
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* HIỂN THỊ THÔNG TIN CHI TIẾT */}
      <div className="p-6 rounded-2xl bg-gray-50 border border-dashed border-gray-200">
        {paymentMethod === 'VNPAY' ? (
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-gray-800">Cổng thanh toán VNPay</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Bạn sẽ được chuyển hướng đến cổng thanh toán VNPay sau khi bấm "Đặt hàng". Vui lòng
              không đóng trình duyệt cho đến khi nhận được thông báo thành công.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-gray-800">Thanh toán tiền mặt</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Phí thu hộ (COD) đã bao gồm trong tổng tiền. Bạn chỉ cần thanh toán đúng số tiền đơn
              hàng cho nhân viên giao hàng.
            </p>
          </div>
        )}
      </div>

      {/* FORM NHẬP THÔNG TIN NGÂN HÀNG */}
      <div className="space-y-5 pt-2 border-t border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <div className="p-2 bg-[#4A8795]/10 rounded-lg">
            <Landmark className="w-5 h-5 text-[#4A8795]" />
          </div>
          Thông tin ngân hàng
          {/* Đổi nhãn thành Bắt buộc với màu đỏ để thu hút sự chú ý */}
          <span className="text-xs font-medium text-red-600 bg-red-50 border border-red-100 px-2 py-1 rounded-full ml-2">
            Bắt buộc
          </span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 p-6 rounded-2xl border border-gray-100 bg-white shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)]">
          {/* Tên ngân hàng */}
          <div className="space-y-2">
            <Label htmlFor="bankName" className="text-sm font-semibold text-gray-700">
              Tên ngân hàng <span className="text-red-500">*</span>
            </Label>
            <Input
              id="bankName"
              placeholder="VD: Vietcombank, MB Bank..."
              className="h-11 bg-gray-50/50 border-gray-200 focus:border-[#4A8795] focus:ring-[#4A8795]/20 focus:bg-white rounded-xl"
              value={bankInfo?.bankName || ''}
              onChange={(e) => updateBankInfo({ ...bankInfo, bankName: e.target.value })}
              required
            />
          </div>

          {/* Số tài khoản */}
          <div className="space-y-2">
            <Label htmlFor="bankAccountNumber" className="text-sm font-semibold text-gray-700">
              Số tài khoản <span className="text-red-500">*</span>
            </Label>
            <Input
              id="bankAccountNumber"
              placeholder="Nhập số tài khoản"
              className="h-11 bg-gray-50/50 border-gray-200 focus:border-[#4A8795] focus:ring-[#4A8795]/20 focus:bg-white rounded-xl"
              value={bankInfo?.bankAccountNumber || ''}
              onChange={(e) => updateBankInfo({ ...bankInfo, bankAccountNumber: e.target.value })}
              required
            />
          </div>

          {/* Tên chủ tài khoản */}
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="accountHolderName" className="text-sm font-semibold text-gray-700">
              Tên chủ tài khoản <span className="text-red-500">*</span>
            </Label>
            <Input
              id="accountHolderName"
              placeholder="NGUYEN VAN A"
              className="h-11 bg-gray-50/50 border-gray-200 focus:border-[#4A8795] focus:ring-[#4A8795]/20 focus:bg-white rounded-xl uppercase"
              value={bankInfo?.accountHolderName || ''}
              onChange={(e) =>
                updateBankInfo({ ...bankInfo, accountHolderName: e.target.value.toUpperCase() })
              }
              required
            />
          </div>
        </div>
      </div>
    </div>
  );
};
