// Ví dụ tại: src/lib/react-query.ts (hoặc main.tsx)
import { QueryClient } from '@tanstack/react-query';

// 👇 Thêm chữ "export" vào đây
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});
