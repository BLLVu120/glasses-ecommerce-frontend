import React, { useState } from 'react';
import { CheckCircle, Package, Truck, Send } from 'lucide-react';

interface DrawerFooterProps {
  onCompleteProcessing: () => void;
  onStartPackaging?: () => void;
  onHandoverToCarrier?: (trackingNumber: string) => void;
  isProcessing?: boolean;
  orderStatus?: string;
  trackingNumber?: string;
}

const DrawerFooter: React.FC<DrawerFooterProps> = ({
  onCompleteProcessing,
  onStartPackaging,
  onHandoverToCarrier,
  isProcessing = false,
  orderStatus,
  trackingNumber: existingTrackingNumber,
}) => {
  const [trackingInput, setTrackingInput] = useState('');
  const [trackingError, setTrackingError] = useState('');

  const handleHandover = () => {
    if (!trackingInput.trim()) {
      setTrackingError('Vui lòng nhập mã vận đơn');
      return;
    }
    setTrackingError('');
    onHandoverToCarrier?.(trackingInput.trim());
  };

  // PROCESSING → show "Hoàn tất gia công"
  if (orderStatus === 'PROCESSING') {
    return (
      <footer className="flex-none p-6 bg-white dark:bg-[#1a2e22] border-t border-slate-200 dark:border-slate-700 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-30">
        <div className="flex flex-col md:flex-row gap-4 h-14">
          <button
            onClick={() => {}}
            className="flex-1 md:flex-[1] flex items-center justify-center gap-2 rounded-lg border-2 border-red-200 hover:border-red-500 text-red-600 hover:text-red-700 dark:text-red-400 dark:border-red-900 font-bold transition-all uppercase tracking-wide hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            Báo lỗi
          </button>
          <button
            onClick={onCompleteProcessing}
            disabled={isProcessing}
            className="flex-1 md:flex-[2] flex items-center justify-center gap-3 rounded-lg bg-white border-2 border-[#25d36b] hover:bg-[#25d36b] text-[#102217] font-black text-lg shadow-lg hover:shadow-xl transition-all uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CheckCircle className="w-6 h-6 font-bold" />
            Hoàn tất gia công
          </button>
        </div>
      </footer>
    );
  }

  // PRODUCED → show "Đóng gói"
  if (orderStatus === 'PRODUCED') {
    return (
      <footer className="flex-none p-6 bg-white dark:bg-[#1a2e22] border-t border-slate-200 dark:border-slate-700 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-30">
        <div className="flex flex-col md:flex-row gap-4 h-14">
          <button
            onClick={onStartPackaging}
            disabled={isProcessing}
            className="flex-1 flex items-center justify-center gap-3 rounded-lg bg-white border-2 border-orange-400 hover:bg-orange-500 hover:text-white text-orange-700 font-black text-lg shadow-lg hover:shadow-xl transition-all uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Package className="w-6 h-6" />
            Bắt đầu đóng gói
          </button>
        </div>
      </footer>
    );
  }

  // PACKAGING → show tracking number input + "Bàn giao cho ĐVVC"
  if (orderStatus === 'PACKAGING') {
    return (
      <footer className="flex-none p-6 bg-white dark:bg-[#1a2e22] border-t border-slate-200 dark:border-slate-700 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-30">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Mã vận đơn <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                value={trackingInput}
                onChange={(e) => {
                  setTrackingInput(e.target.value);
                  if (trackingError) setTrackingError('');
                }}
                placeholder="Nhập mã vận đơn từ ĐVVC..."
                className={`flex-1 px-4 py-3 rounded-lg border-2 text-sm font-medium transition-colors bg-white dark:bg-slate-800 dark:text-white ${
                  trackingError
                    ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
                    : 'border-slate-300 dark:border-slate-600 focus:border-purple-500 focus:ring-purple-200'
                } focus:outline-none focus:ring-2`}
              />
              <button
                onClick={handleHandover}
                disabled={isProcessing}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm shadow-lg hover:shadow-xl transition-all uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                <Truck className="w-5 h-5" />
                Bàn giao cho ĐVVC
              </button>
            </div>
            {trackingError && (
              <p className="text-red-500 text-xs mt-1 font-medium">{trackingError}</p>
            )}
          </div>
        </div>
      </footer>
    );
  }

  // HANDED_TO_CARRIER → show success state with tracking number
  if (orderStatus === 'HANDED_TO_CARRIER') {
    return (
      <footer className="flex-none p-6 bg-white dark:bg-[#1a2e22] border-t border-slate-200 dark:border-slate-700 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-30">
        <div className="flex items-center gap-3 p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
          <Send className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-bold text-purple-800 dark:text-purple-300">
              Đã bàn giao cho ĐVVC
            </p>
            {existingTrackingNumber && (
              <p className="text-xs text-purple-600 dark:text-purple-400 mt-0.5">
                Mã vận đơn: <span className="font-mono font-bold">{existingTrackingNumber}</span>
              </p>
            )}
          </div>
          <CheckCircle className="w-6 h-6 text-purple-600 dark:text-purple-400 flex-shrink-0" />
        </div>
      </footer>
    );
  }

  // Default fallback
  return null;
};

export default DrawerFooter;
