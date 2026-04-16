import { useAuthStore } from '@/features/auth/stores/useAuthStore';
import StorefrontHeader from './storefront/StorefrontHeader';
import WorkspaceHeader from './workspace/WorkspaceHeader';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

export default function Header() {
  const { user } = useAuthStore();

  // 1. Khách hàng (Chưa login hoặc role = customer)
  if (!user || user.role === 'customer') {
    return <StorefrontHeader />;
  }

  // 2. Sales Staff
  if (user.role === 'sale') {
    return (
      <WorkspaceHeader
        roleName="SALES"
        roleColor="text-blue-600"
        searchPlaceholder="Tìm đơn hàng, SĐT khách..."
      >
        <Button size="sm" className="bg-blue-600 hover:bg-blue-700 gap-2 shadow-sm">
          <PlusCircle className="w-4 h-4" /> Tạo đơn mới
        </Button>
      </WorkspaceHeader>
    );
  }

  // 3. Các vai trò còn lại dùng giao diện storefront mặc định
  return <StorefrontHeader />;
}
