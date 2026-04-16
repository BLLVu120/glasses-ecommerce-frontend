// src/components/AuthProvider.tsx (hoặc wrap trong App)
import { useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useAuthStore } from '@/features/auth/stores/useAuthStore';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { token, refreshAction, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated || !token) return;

    const checkAndRefresh = () => {
      try {
        const decoded = jwtDecode<{ exp: number }>(token);
        const timeLeft = decoded.exp * 1000 - Date.now();
        if (timeLeft < 2 * 60 * 1000 && timeLeft > 0) {
          // còn < 2 phút
          console.log("test");
          refreshAction();
        }
      } catch {
        // Token invalid → logout
        useAuthStore.getState().logout();
      }
    };

    checkAndRefresh(); // check ngay khi mount

    const interval = setInterval(checkAndRefresh, 60 * 1000); // mỗi phút

    return () => clearInterval(interval);
  }, [token, isAuthenticated, refreshAction]);

  return <>{children}</>;
};
