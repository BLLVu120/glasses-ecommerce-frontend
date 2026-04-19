// Đổi import từ Header cũ sang WorkspaceHeader mới
import { Outlet } from 'react-router-dom';
import { cn } from '@/lib/utils';
import WorkspaceHeader from '@/components/layout/header/workspace/WorkspaceHeader';
import { Sidebar } from './Sidebar';
import { SidebarProvider } from './SidebarContext';
import { useSidebar } from '../hooks/useSidebar';


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

        

export function AdminDashboardLayout() {
  return (
    <SidebarProvider>
      <DashboardContent />
    </SidebarProvider>
  );
}

export function AdminDashboardLayout() {
  return (
    <SidebarProvider>
      <DashboardContent />
    </SidebarProvider>
  );
}
export function AdminDashboardLayout() {
  return (
    <SidebarProvider>
      <DashboardContent />
    </SidebarProvider>
  );
}
