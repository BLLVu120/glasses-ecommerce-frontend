import { X, ShoppingBag, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '../store/useCartStore';
import { useNavigate } from 'react-router-dom';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from '@/components/ui/sheet';
import { CartItemRow } from './CartItemRow';

export const CartDrawer = () => {
  const { items, isOpen, closeCart, removeFromCart, updateQuantity, getCartTotal } = useCartStore();
  const navigate = useNavigate();

  const totalAmount = getCartTotal();

  return (
    <Sheet open={isOpen} onOpenChange={closeCart}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md p-0 flex flex-col gap-0 border-l shadow-2xl [&>button]:hidden bg-[#F4F4F5]"
      >
        {/* HEADER */}
        <div className="flex items-center justify-between p-5 border-b bg-white shrink-0 z-10">
          <div className="flex items-center gap-3">
            <div className="relative">
              <ShoppingBag className="w-6 h-6 text-zinc-900" />
              <span className="absolute -top-2 -right-2 bg-zinc-900 text-white text-[10px] min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full font-black border-2 border-white shadow-sm">
                {items.length}
              </span>
            </div>
            <SheetHeader>
              <SheetTitle className="text-xl font-black uppercase tracking-tighter text-zinc-900">
                Giỏ hàng
              </SheetTitle>
            </SheetHeader>
          </div>
          <SheetClose asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-zinc-100 transition-transform active:scale-90"
            >
              <X className="w-5 h-5 text-zinc-500" />
            </Button>
          </SheetClose>
        </div>

        {/* BODY LIST - Đã đổi background sang màu xám nhạt để Card nổi bật lên */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-zinc-300">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-10 bg-white rounded-3xl m-2 border border-zinc-100">
              <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center mb-4">
                <ShoppingBag className="w-10 h-10 text-zinc-200" />
              </div>
              <h4 className="text-lg font-black text-zinc-900 tracking-tight mb-2 uppercase">
                Giỏ hàng trống
              </h4>
              <p className="text-sm text-zinc-500 mb-6">Có vẻ như bạn chưa thêm sản phẩm nào.</p>
              <SheetClose asChild>
                <Button className="bg-zinc-900 hover:bg-zinc-800 rounded-xl px-8 font-bold">
                  Mua sắm ngay
                </Button>
              </SheetClose>
            </div>
          ) : (
            items.map((item) => (
              <CartItemRow
                key={item.id}
                item={item}
                updateQuantity={updateQuantity}
                removeFromCart={removeFromCart}
              />
            ))
          )}
        </div>

        {/* FOOTER */}
        {items.length > 0 && (
          <div className="p-5 border-t bg-white shrink-0 space-y-4 shadow-[0_-15px_30px_-15px_rgba(0,0,0,0.05)] z-10 rounded-t-3xl">
            <div className="space-y-1.5 px-1">
              <div className="flex justify-between items-center pt-2">
                <span className="text-sm font-black text-zinc-900 uppercase tracking-tighter">
                  Tổng tạm tính
                </span>
                <span className="text-2xl font-black text-zinc-900 tracking-tighter">
                  {totalAmount.toLocaleString()}₫
                </span>
              </div>
            </div>

            <Button
              onClick={() => {
                closeCart();
                navigate('/checkout');
              }}
              className="w-full h-14 bg-zinc-900 hover:bg-black text-white font-black rounded-2xl shadow-xl shadow-zinc-900/20 transition-all active:scale-[0.98] flex items-center justify-center gap-3 group tracking-widest text-[13px]"
            >
              TIẾN HÀNH THANH TOÁN
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};
