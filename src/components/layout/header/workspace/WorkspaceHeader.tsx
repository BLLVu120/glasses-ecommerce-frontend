import { type ReactNode } from 'react';
import { Search, Menu } from 'lucide-react'; // Xoá Bell ở đây vì NotificationDropdown đã chứa sẵn Bell rồi
import { WorkspaceUserMenu } from './WorkspaceUserMenu';

// 👇 1. Import Component Notification từ file index của feature
import { NotificationDropdown } from '@/features/notification';

interface WorkspaceHeaderProps {
  roleName: string;
  roleColor?: string;
  searchPlaceholder?: string;
  onMenuClick?: () => void;
  children?: ReactNode;
}

export default function WorkspaceHeader({
  roleName,
  roleColor,
  searchPlaceholder,
  onMenuClick,
  children,
}: WorkspaceHeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-white border-b h-16 flex items-center justify-between px-4 sm:px-6 shadow-sm">
      {/* LEFT: Menu Toggle (Mobile) & Role Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-gray-100 rounded-md transition-colors"
        >
          <Menu className="w-5 h-5 text-gray-600" />
        </button>

        <div className="hidden sm:flex flex-col">
          <span className="font-bold text-[10px] tracking-widest text-gray-400 uppercase">
            System Portal
          </span>
          <span
            className={`font-bold text-lg tracking-tight leading-none ${roleColor || 'text-gray-800'}`}
          >
            {roleName}
          </span>
        </div>
      </div>

      {/* CENTER: Search Bar */}
      <div className="flex-1 max-w-2xl mx-4 sm:mx-6 relative hidden md:block">
        <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
        <input
          placeholder={searchPlaceholder || 'Search...'}
          className="w-full h-10 pl-10 pr-4 rounded-md border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-black/10 outline-none text-sm transition-all placeholder:text-gray-400"
        />
      </div>

      {/* RIGHT: Actions & User Menu */}
      <div className="flex items-center gap-2 sm:gap-4">
        {children}

        <div className="h-6 w-px bg-gray-200 mx-1 hidden sm:block"></div>

        {/* 👇 2. Đặt NotificationDropdown thay cho cái button cũ */}
        <NotificationDropdown />

        {/* User Menu Component */}
        <WorkspaceUserMenu />
      </div>
    </header>
  );
}
