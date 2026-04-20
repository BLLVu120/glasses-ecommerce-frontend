import { Outlet } from 'react-router-dom';
import { cn } from '@/lib/utils';
import WorkspaceHeader from '@/components/layout/header/workspace/WorkspaceHeader';
import { Sidebar } from './Sidebar';
import { SidebarProvider } from './SidebarContext';
import { useSidebar } from '../hooks/useSidebar';

function DashboardContent() {
  const { collapsed, toggleCollapsed } = useSidebar();

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />

      <div className={cn('transition-all duration-300', collapsed ? 'pl-16' : 'pl-64')}>
        <WorkspaceHeader
          roleName="Quản Lý Hệ Thống (Quản trị viên)"
          roleColor="text-blue-600"
          searchPlaceholder="Tìm kiếm nhân viên, báo cáo, sản phẩm..."
          onMenuClick={toggleCollapsed}
        />

        <main className="min-h-[calc(100vh-4rem)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export function AdminDashboardLayout() {
  return (
    <SidebarProvider>
      <DashboardContent />
    </SidebarProvider>
  );
}
