import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSidebar } from '../hooks/useSidebar';
import Logo from '@/components/common/Logo';
import { useAuthStore } from '@/features/auth/stores/useAuthStore';

// Danh sách menu dành riêng cho Seller
const sellerNavigation = [{ name: 'Bảng điều khiển', href: '/seller', icon: LayoutDashboard }];

export function SellerSidebar() {
  const { collapsed, toggleCollapsed } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();

  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

export function SellerSidebar() {
  const { collapsed, toggleCollapsed } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();

  const { user, logout } = useAuthStore();


  const getInitials = (name?: string) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-full bg-sidebar border-r border-sidebar-border transition-all duration-300 z-50 flex flex-col',
        collapsed ? 'w-16' : 'w-64',
      )}
    >
      {/* Logo */}
      <div className="h-16 md:h-20 flex items-center justify-between px-4 border-sidebar-border">
        {!collapsed && <Logo />}
        <button
          onClick={toggleCollapsed}
          className={cn(
            'p-1.5 rounded-lg text-sidebar-muted hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors',
            collapsed && 'mx-auto',
          )}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {sellerNavigation.map((item) => {
          const isActive =
            location.pathname === item.href || location.pathname.startsWith(`${item.href}/`);
          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={cn(
                'nav-item',
                isActive && 'nav-item-active',
                collapsed && 'justify-center px-2',
              )}
              title={collapsed ? item.name : undefined}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span>{item.name}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="p-3 border-t border-sidebar-border">
        <div className={cn('flex items-center gap-3', collapsed && 'justify-center')}>
          <div className="w-9 h-9 rounded-full bg-sidebar-accent flex items-center justify-center text-sidebar-foreground font-medium text-sm shrink-0 uppercase">
            {getInitials(user?.name)}
          </div>

          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">
                {user?.name || 'Nhân viên bán hàng'}
              </p>
              <p className="text-xs text-sidebar-muted truncate uppercase">
                {user?.role || 'SELLER'}
              </p>
            </div>
          )}

          {!collapsed && (
            <button
              onClick={handleLogout}
              title="Đăng xuất"
              className="p-1.5 rounded-lg text-sidebar-muted hover:text-rose-600 hover:bg-rose-50 transition-colors shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
