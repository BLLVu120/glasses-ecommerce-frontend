import { Sidebar } from '@/features/shipper/layout/Sidebar';
import { Outlet } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { SidebarProvider } from '@/features/shipper/layout/SidebarContext';
import { useSidebar } from '@/features/shipper/hooks/useSidebar';
import WorkspaceHeader from '@/components/layout/header/workspace/WorkspaceHeader';

function DashboardContent() {
   const { collapsed, toggleCollapsed } = useSidebar();

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className={cn('transition-all duration-300', collapsed ? 'pl-16' : 'pl-64')}>
        <WorkspaceHeader
                  roleName="Nhân Viên Giao Hàng"
                  roleColor="text-teal-600" // Màu xanh ngọc (bạn có thể đổi thành teal-600 hoặc green-600)
                  searchPlaceholder="Giao hàng..."
                  onMenuClick={toggleCollapsed}
                />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export function ShipperDashboardLayout() {
  return (
    <SidebarProvider>
      <DashboardContent />
    </SidebarProvider>
  );
}
