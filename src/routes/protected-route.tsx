import { useAuthStore } from '@/features/auth/stores/useAuthStore';
import { Navigate } from 'react-router-dom';

// components/ProtectedRoute.tsx
type AllowedRoles = 'admin' | 'sale' | 'customer';

interface Props {
  children: React.ReactNode;
  allowedRoles?: AllowedRoles[];
}

export function RequireRole({ children, allowedRoles }: Props) {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user!.role as AllowedRoles)) {
    return <Navigate to="/" replace />; // hoặc trang "Không có quyền"
  }

  return <>{children}</>;
}
