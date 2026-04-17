import { LogOut, User, Settings, ChevronDown } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/stores/useAuthStore';

export function WorkspaceUserMenu() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    // Lưu ý: Kiểm tra lại xem route đăng nhập của bạn là "/login" hay "/auth/login" nhé
    navigate('/auth/login');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none group">
        <div className="flex items-center gap-3 text-right hover:bg-gray-50 p-1.5 pr-2 rounded-full transition-colors border border-transparent hover:border-gray-100 cursor-pointer">
          <div className="hidden xl:block">
            <p className="text-xs font-bold text-gray-900 group-hover:text-black transition-colors">
              {user?.name || 'Nhân viên'}
            </p>
            <p className="text-[10px] text-gray-500 font-medium">
              {user?.role ? user.role.toUpperCase() : 'STAFF'} • ID: #{user?.id || '000'}
            </p>
          </div>
          <Avatar className="h-8 w-8 border border-gray-200 group-hover:border-gray-300 transition-colors">
            {/* Thêm fallback image nếu user.avatar bị lỗi hoặc null */}
            <AvatarImage src={user?.avatar} alt={user?.name} />
            <AvatarFallback className="bg-zinc-900 text-white font-bold text-xs">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <ChevronDown className="w-3 h-3 text-gray-400 hidden xl:block group-hover:text-gray-600 transition-colors" />
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56 mt-2">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.name}</p>
            <p className="text-xs leading-none text-gray-500">{user?.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem className="cursor-pointer">
          <Settings className="mr-2 h-4 w-4" />
          <span>Cài đặt hệ thống</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleLogout}
          className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Đăng xuất</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
