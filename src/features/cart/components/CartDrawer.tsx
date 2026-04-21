import { X, ShoppingBag, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from '@/components/ui/sheet';
import { useCartStore } from '../store/useCartStore';
import { CartItemRow } from './CartItemRow';

export const CartDrawer = () => {
  const { items, isOpen, closeCart, removeFromCart, updateQuantity, getCartTotal } = useCartStore();
  const navigate = useNavigate();
  const totalAmount = getCartTotal();

  return (
    <Sheet open={isOpen} onOpenChange={closeCart}>
      <SheetContent
        side="right"
        className="w-full gap-0 border-l bg-[#F4F4F5] p-0 shadow-2xl sm:max-w-md [&>button]:hidden"
      >
        <div className="z-10 flex shrink-0 items-center justify-between border-b bg-white p-5">
          <div className="flex items-center gap-3">
            <div className="relative">
              <ShoppingBag className="h-6 w-6 text-zinc-900" />
              <span className="absolute -right-2 -top-2 flex h-[18px] min-w-[18px] items-center justify-center rounded-full border-2 border-white bg-zinc-900 px-1 text-[10px] font-black text-white shadow-sm">
                {items.length}
              </span>
            </div>

            <SheetHeader>
              <SheetTitle className="text-xl font-black uppercase tracking-tighter text-zinc-900">
                Gio hang
              </SheetTitle>
            </SheetHeader>
          </div>

          <SheetClose asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full transition-transform hover:bg-zinc-100 active:scale-90"
            >
              <X className="h-5 w-5 text-zinc-500" />
            </Button>
          </SheetClose>
        </div>

        <div className="scrollbar-thin scrollbar-thumb-zinc-300 flex-1 space-y-4 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="m-2 flex h-full flex-col items-center justify-center rounded-3xl border border-zinc-100 bg-white p-10 text-center">
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-zinc-50">
                <ShoppingBag className="h-10 w-10 text-zinc-200" />
              </div>
              <h4 className="mb-2 text-lg font-black uppercase tracking-tight text-zinc-900">
                Gio hang trong
              </h4>
              <p className="mb-6 text-sm text-zinc-500">Ban chua them san pham nao.</p>
              <SheetClose asChild>
                <Button className="rounded-xl bg-zinc-900 px-8 font-bold hover:bg-zinc-800">
                  Mua sam ngay
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

        {items.length > 0 && (
          <div className="z-10 shrink-0 space-y-4 rounded-t-3xl border-t bg-white p-5 shadow-[0_-15px_30px_-15px_rgba(0,0,0,0.05)]">
            <div className="space-y-1.5 px-1">
              <div className="flex items-center justify-between pt-2">
                <span className="text-sm font-black uppercase tracking-tighter text-zinc-900">
                  Tong tam tinh
                </span>
                <span className="text-2xl font-black tracking-tighter text-zinc-900">
                  {totalAmount.toLocaleString()}d
                </span>
              </div>
            </div>

            <Button
              onClick={() => {
                closeCart();
                navigate('/checkout');
              }}
              className="group flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-zinc-900 text-[13px] font-black tracking-widest text-white shadow-xl shadow-zinc-900/20 transition-all hover:bg-black active:scale-[0.98]"
            >
              TIEN HANH THANH TOAN
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};