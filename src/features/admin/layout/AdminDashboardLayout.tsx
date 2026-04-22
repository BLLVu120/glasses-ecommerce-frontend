// Đổi import từ Header cũ sang WorkspaceHeader mới
import { Outlet } from 'react-router-dom';
import { cn } from '@/lib/utils';
import WorkspaceHeader from '@/components/layout/header/workspace/WorkspaceHeader';
import { Sidebar } from './Sidebar';
import { SidebarProvider } from './SidebarContext';
import { useSidebar } from '../hooks/useSidebar';

function DashboardContent() {
  // Lấy thêm hàm toggleCollapsed để truyền vào nút Hamburger menu trên Mobile
  const { collapsed, toggleCollapsed } = useSidebar();

  return (
    // Đổi bg-background (thường là trắng) thành bg-slate-50 để làm nổi khối giao diện
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <div className={cn('transition-all duration-300', collapsed ? 'pl-16' : 'pl-64')}>
        {/* Lắp WorkspaceHeader vào đây */}
        <WorkspaceHeader
          roleName="Quản Lý Hệ Thống (Quản trị viên)"
          roleColor="text-blue-600" // Đổi màu tuỳ ý (blue, indigo, violet...)
          searchPlaceholder="Tìm kiếm nhân viên, báo cáo, sản phẩm..."
          onMenuClick={toggleCollapsed}
        />

        {/* Chỉnh lại padding một chút để Responsive tốt hơn trên điện thoại (sm:p-6) */}
        <main className="p-4 sm:p-6">
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
