import { Sidebar } from '@/features/operation-staff/layout/Sidebar';
// Import WorkspaceHeader mới thay cho Header cũ (bạn nhớ check lại đường dẫn nhé)
import { Outlet } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { SidebarProvider } from '@/features/operation-staff/layout/SidebarContext';
import { useSidebar } from '@/features/operation-staff/hooks/useSidebar';
import WorkspaceHeader from '@/components/layout/header/workspace/WorkspaceHeader';

function DashboardContent() {
  // Lấy thêm hàm toggleCollapsed để truyền vào nút Hamburger menu trên Mobile
  const { collapsed, toggleCollapsed } = useSidebar();

  return (
    // Đồng bộ nền xám nhạt (bg-slate-50) để làm nổi bật các thẻ trắng bên trong
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <div className={cn('transition-all duration-300', collapsed ? 'pl-16' : 'pl-64')}>
        {/* Lắp WorkspaceHeader vào đây */}
        <WorkspaceHeader
          roleName="Nhân Viên Vận Hành"
          roleColor="text-emerald-600" // Màu xanh ngọc (bạn có thể đổi thành teal-600 hoặc green-600)
          searchPlaceholder="Tìm kiếm công việc, đơn tròng kính, lịch trình..."
          onMenuClick={toggleCollapsed}
        />

        {/* Chỉnh lại padding một chút để Responsive tốt hơn trên điện thoại */}
        <main className="p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export function OpsStaffDashboardLayout() {
  return (
    <SidebarProvider>
      <DashboardContent />
    </SidebarProvider>
  );
}
