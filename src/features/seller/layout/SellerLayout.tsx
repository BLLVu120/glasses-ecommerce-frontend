import { Outlet } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { SidebarProvider } from './SidebarContext';
import { useSidebar } from '../hook/useSidebar';

// Đường dẫn import tùy thuộc vào cấu trúc thư mục của bạn
import { SellerSidebar } from './Sidebar';
import WorkspaceHeader from '@/components/layout/header/workspace/WorkspaceHeader';

function SellerDashboardContent() {
  // Lấy cả state collapsed và hàm toggleCollapsed từ context
  const { collapsed, toggleCollapsed } = useSidebar();

  return (
    // Thêm bg-gray-50/50 hoặc bg-slate-50 để phần main nổi bật hơn so với sidebar/header màu trắng
    <div className="min-h-screen bg-slate-50">
      {/* 1. Sidebar */}
      <SellerSidebar />

      {/* 2. Main Content Wrapper */}
      <div className={cn('transition-all duration-300', collapsed ? 'pl-16' : 'pl-64')}>
        {/* 3. Lắp WorkspaceHeader thay cho Header cũ */}
        <WorkspaceHeader
          roleName="Kênh Người Bán"
          roleColor="text-orange-600" // Đổi màu chữ tuỳ thích (cam, xanh dương...)
          searchPlaceholder="Tìm kiếm đơn hàng, sản phẩm..."
          onMenuClick={toggleCollapsed} // Truyền hàm để mở sidebar trên mobile
        />

        {/* 4. Nội dung các trang con (OrderPage, ProductPage...) */}
        <main className="p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export function SellerLayout() {
  return (
    <SidebarProvider>
      <SellerDashboardContent />
    </SidebarProvider>
  );
}
