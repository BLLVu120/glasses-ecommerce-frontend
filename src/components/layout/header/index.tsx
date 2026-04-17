import { useAuthStore } from '@/features/auth/stores/useAuthStore';
import StorefrontHeader from './storefront/StorefrontHeader';
import WorkspaceHeader from './workspace/WorkspaceHeader';
import { Button } from '@/components/ui/button';

import { PlusCircle, ScanBarcode, Settings } from 'lucide-react';


export default function Header() {
  const { user } = useAuthStore();

  // 1. Khách hàng (Chưa login hoặc role = customer)
  if (!user || user.role === 'customer') {
    return <StorefrontHeader/>;
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


  // 3. Ops Staff
  if (user.role === 'operation') {
    return (
      <WorkspaceHeader
        roleName="OPERATIONS"
        roleColor="text-orange-600"
        searchPlaceholder="Quét mã vận đơn, SKU..."
      >
        <Button
          size="sm"
          variant="outline"
          className="gap-2 border-orange-200 text-orange-700 hover:bg-orange-50"
        >
          <ScanBarcode className="w-4 h-4" /> Scan
        </Button>
      </WorkspaceHeader>
    );
  }

  // 4. Admin
  return (
    <WorkspaceHeader roleName="ADMIN" roleColor="text-purple-600">
      <Button variant="ghost" size="sm" className="gap-2">
        <Settings className="w-4 h-4" /> Config
      </Button>
    </WorkspaceHeader>
  );

}
