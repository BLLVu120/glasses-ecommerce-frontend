import { NavLink } from 'react-router-dom';
import { User, Package } from 'lucide-react';
import { cn } from '@/lib/utils';

const sidebarItems = [
  {
    title: 'Thông tin cá nhân',
    href: '/profile',
    icon: User,
    end: true, // Exact match for the root profile path
  },
  {
    title: 'Đơn hàng của tôi',
    href: '/profile/orders',
    icon: Package,
  },
];

export function ProfileSidebar() {
  return (
    <nav className="flex flex-col space-y-1">
      {sidebarItems.map((item) => (
        <NavLink
          key={item.href}
          to={item.href}
          end={item.end}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 px-4 py-3 text-sm transition-colors rounded-md',
              isActive
                ? 'bg-primary/10 text-primary font-medium'
                : 'text-muted-foreground hover:bg-gray-50 hover:text-gray-900',
            )
          }
        >
          <item.icon className="w-5 h-5" />
          {item.title}
        </NavLink>
      ))}
    </nav>
  );
}
