import { ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/features/cart/store/useCartStore';
import { Button } from '@/components/ui/button';

export default function CartButton() {
  // 1. Lấy đủ các hàm và state
  const { openCart, closeCart, isOpen, items } = useCartStore();

  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <Button
      variant="ghost"
      size="icon"
      // 2. Logic Toggle: Đang mở thì đóng, đang đóng thì mở
      onClick={() => (isOpen ? closeCart() : openCart())}
      className={`relative text-gray-700 hover:text-black hover:bg-gray-100 ${isOpen ? 'bg-gray-100' : ''}`}
    >
      <ShoppingBag className="w-6 h-6" />

      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-[#4A8795] text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-white">
          {itemCount}
        </span>
      )}
    </Button>
  );
}
