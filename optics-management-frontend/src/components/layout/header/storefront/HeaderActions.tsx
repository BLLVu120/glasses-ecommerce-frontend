import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, LogOut, User, History, Search, X } from 'lucide-react'; // 1. Đã xoá icon Bell vì NotificationDropdown đã có
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

// STORES & HOOKS
import { useAuthStore } from '@/features/auth/stores/useAuthStore';
import { useCartStore } from '@/features/cart/store/useCartStore';

import { NotificationDropdown } from '@/features/notification';

export default function HeaderActions() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  // State để quản lý việc ẩn/hiện search bar trên mobile
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  // --- SELECTORS ---
  const { user, logout } = useAuthStore();
  const { openCart, closeCart, isOpen, items } = useCartStore();

  // --- DERIVED STATE ---
  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);
  // 3. Đã xoá biến unreadNotifications thừa thãi

  // --- HANDLERS ---
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setShowMobileSearch(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // Logic hiển thị Avatar
  const displayName = profile?.firstName ? `${profile.firstName} ${profile.lastName}` : user?.name;
  const displayEmail = profile?.email || user?.email;
  const displayAvatar = profile?.imageUrl || user?.avatar;
  const displayInitials = (displayName || 'U').charAt(0).toUpperCase();

  return (
    <div className="flex items-center gap-3 md:gap-4">
      {/* 1. NÚT KÍNH LÚP CHO MOBILE */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
        onClick={() => setShowMobileSearch(!showMobileSearch)}
      >
        {showMobileSearch ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
      </Button>

      {/* 2. DROPDOWN SEARCH CHO MOBILE */}
      {showMobileSearch && (
        <div className="absolute top-full left-0 w-full bg-white border-b border-gray-100 p-4 shadow-lg lg:hidden animate-in fade-in slide-in-from-top-2 z-50">
          <form onSubmit={handleSearch} className="relative flex items-center max-w-md mx-auto">
            <Search className="absolute left-4 w-5 h-5 text-gray-400" />
            <Input
              autoFocus
              type="text"
              placeholder="Tìm kính, thương hiệu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-12 w-full pl-12 pr-4 bg-gray-50 border-gray-200 rounded-xl focus-visible:ring-2 focus-visible:ring-gray-300 text-base"
            />
            <button type="submit" className="hidden">
              Search
            </button>
          </form>
        </div>
      )}

      {/* 3. THANH SEARCH CHO DESKTOP */}
      <form
        onSubmit={handleSearch}
        className="relative hidden lg:flex items-center group w-48 xl:w-64 transition-all duration-300 focus-within:w-72"
      >
        <Search className="absolute left-3 w-4 h-4 text-gray-400 group-focus-within:text-black transition-colors" />
        <Input
          type="text"
          placeholder="Tìm kính, thương hiệu..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-10 pl-9 pr-4 bg-gray-50 border-none rounded-full focus-visible:ring-1 focus-visible:ring-gray-200 transition-all text-sm"
        />
        <button type="submit" className="hidden">
          Search
        </button>
      </form>

      {/* SHOPPING CART */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => (isOpen ? closeCart() : openCart())}
        className={`relative rounded-full transition-all ${isOpen ? 'bg-gray-100 text-black shadow-inner' : 'text-gray-600'}`}
      >
        <ShoppingBag className="w-5 h-5" />
        {cartItemCount > 0 && (
          <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 rounded-full bg-zinc-900 text-white text-[10px] border-2 border-white">
            {cartItemCount}
          </Badge>
        )}
      </Button>

      {/* USER SECTION */}
      {!user ? (
        <GuestActions />
      ) : (
        <div className="flex items-center gap-2">
          {/* 👇 4. Thay NotificationButton bằng NotificationDropdown thực tế */}
          <div className="hidden sm:block">
            <NotificationDropdown />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-10 w-10 rounded-full p-0 ring-offset-2 hover:ring-2 ring-gray-200 transition-all"
              >
                <Avatar className="h-9 w-9 border border-gray-100 shadow-sm">
                  <AvatarImage
                    src={displayAvatar}
                    alt={displayName || ''}
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-stone-100 text-stone-600 font-bold text-xs">
                    {displayInitials}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              className="w-64 rounded-2xl p-2 mt-2 shadow-2xl border-stone-100"
              align="end"
            >
              <DropdownMenuLabel className="font-normal px-3 py-4">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-semibold text-gray-900">
                    {isLoading ? 'Đang tải...' : displayName}
                  </p>
                  <p className="text-xs text-gray-400 italic">{displayEmail}</p>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator className="bg-gray-50" />

              <div className="py-1">
                <DropdownItemLink
                  to="/profile"
                  icon={<User className="mr-3 h-4 w-4" />}
                  label="Tài khoản cá nhân"
                />
                <DropdownItemLink
                  to="/profile/orders"
                  icon={<History className="mr-3 h-4 w-4" />}
                  label="Lịch sử đơn hàng"
                />
              </div>

              <DropdownMenuSeparator className="bg-gray-50" />

              <DropdownMenuItem
                onClick={handleLogout}
                className="text-red-500 focus:bg-red-50 focus:text-red-600 rounded-xl cursor-pointer m-1 px-3 h-10 transition-colors"
              >
                <LogOut className="mr-3 h-4 w-4" /> Đăng xuất
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  );
}

// --- SUB-COMPONENTS ---

function GuestActions() {
  return (
    <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-2">
      <div className="w-px h-6 bg-gray-200 mx-1 hidden sm:block"></div>
      <Link to="/auth/login">
        <Button
          variant="ghost"
          size="sm"
          className="font-bold text-xs uppercase tracking-widest text-gray-500"
        >
          Đăng nhập
        </Button>
      </Link>
      <Link to="/auth/register">
        <Button
          size="sm"
          className="rounded-full bg-zinc-900 text-white px-5 h-10 text-xs font-bold uppercase tracking-widest shadow-lg"
        >
          Tham gia
        </Button>
      </Link>
    </div>
  );
}

// 5. Đã xoá function NotificationButton giả

function DropdownItemLink({
  to,
  icon,
  label,
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <DropdownMenuItem asChild className="rounded-xl cursor-pointer m-1 px-3 h-10 focus:bg-stone-50">
      <Link to={to} className="flex items-center text-gray-600 font-medium">
        {icon} {label}
      </Link>
    </DropdownMenuItem>
  );
}
