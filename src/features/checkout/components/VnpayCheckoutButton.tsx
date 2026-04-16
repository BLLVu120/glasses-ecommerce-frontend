import { useCheckoutVnpay } from '../hooks/useCheckoutVnpay';
import { Button } from '@/components/ui/button';
import { Loader2, CreditCard } from 'lucide-react'; // Import thêm icon CreditCard

interface VnpayCheckoutButtonProps {
  orderId: string;
  className?: string;
}

export function VnpayCheckoutButton({ orderId, className }: VnpayCheckoutButtonProps) {
  const { mutate, isPending } = useCheckoutVnpay();

  return (
    <Button
      onClick={(e) => {
        e.stopPropagation();
        mutate(orderId);
      }}
      disabled={isPending}
      className={`relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 border-none ${className || ''}`}
    >
      {isPending ? (
        <span className="flex items-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin" />
          Đang tạo link thanh toán...
        </span>
      ) : (
        <span className="flex items-center justify-center gap-2">
          <CreditCard className="w-5 h-5" />
          Thanh toán qua VNPay
        </span>
      )}
    </Button>
  );
}