import React from 'react';
import { CreditCard, MapPin, Phone, DollarSign } from 'lucide-react';
import type { BEOrder } from '@/features/operation-staff/types/types';

interface PaymentInfoSectionProps {
  order: BEOrder;
}

const PaymentInfoSection: React.FC<PaymentInfoSectionProps> = ({ order }) => {
  const remainingAmount = (order.totalAmount || 0) - (order.depositAmount || 0);
  const paidAmount = order.depositAmount || 0;

  const formatCurrency = (amount: number) => {
    if (amount === 0 || !amount) {
      return '0 ₫';
    }
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const displayValue = (
    value: string | null | undefined,
    fallback: string = 'Chưa có thông tin',
  ) => {
    return value || fallback;
  };

  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <CreditCard className="w-5 h-5 text-slate-400" />
        <h3 className="text-slate-900 dark:text-white text-lg font-bold uppercase tracking-wide">
          Thông tin thanh toán
        </h3>
      </div>

      <div className="bg-white dark:bg-[#1a2e22] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 space-y-4">
        {/* Delivery Address */}
        <div className="flex items-start gap-3">
          <MapPin className="w-5 h-5 text-slate-400 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Địa chỉ giao hàng
            </p>
            <p className="text-slate-900 dark:text-white font-medium">
              {displayValue(order.deliveryAddress)}
            </p>
          </div>
        </div>

        {/* Phone Number */}
        <div className="flex items-start gap-3">
          <Phone className="w-5 h-5 text-slate-400 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Số điện thoại</p>
            <p className="text-slate-900 dark:text-white font-medium">
              {displayValue(order.phoneNumber)}
            </p>
          </div>
        </div>

        {/* Payment Details */}
        <div className="border-t border-slate-200 dark:border-slate-700 pt-4 space-y-3">
          <div className="flex items-center gap-3">
            <DollarSign className="w-5 h-5 text-slate-400" />
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-3">
                Chi tiết thanh toán
              </p>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Tổng tiền:</span>
                  <span className="text-slate-900 dark:text-white font-medium">
                    {formatCurrency(order.totalAmount)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Đặt cọc:</span>
                  <span className="text-green-600 dark:text-green-400 font-medium">
                    {formatCurrency(paidAmount)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Còn lại:</span>
                  <span className="text-orange-600 dark:text-orange-400 font-medium">
                    {formatCurrency(remainingAmount)}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t border-slate-200 dark:border-slate-700">
                  <span className="text-slate-900 dark:text-white">Đã thanh toán:</span>
                  <span className="text-green-600 dark:text-green-400">
                    {formatCurrency(paidAmount)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PaymentInfoSection;
