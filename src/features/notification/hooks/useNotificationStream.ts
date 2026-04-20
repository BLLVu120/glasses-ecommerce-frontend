import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import { useAuthStore } from '@/features/auth/stores/useAuthStore';
import type { NotificationItem } from '../types';

export const useNotificationStream = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    // 1. Lấy token từ Zustand Store
    const token = useAuthStore.getState().token;
    if (!token) return;

    // 2. Lấy Base URL từ biến môi trường
    const baseUrl = import.meta.env.VITE_API_URL;

    // 3. Khởi tạo AbortController để quản lý việc đóng/mở kết nối
    const ctrl = new AbortController();

    // 4. Hàm kết nối SSE (dùng async/await)
    const connectStream = async () => {
      try {
        await fetchEventSource(`${baseUrl}notifications/stream`, {
          method: 'GET',
          headers: {
            Accept: 'text/event-stream',
            Authorization: `Bearer ${token}`, // 🌟 Token nằm đúng chỗ backend cần
          },
          signal: ctrl.signal, // Gắn cờ để tắt kết nối khi cần

          // Khi nhận được tin nhắn từ server
          onmessage(event) {
            // Đôi khi server gửi gói tin rỗng (ping) để giữ kết nối, ta bỏ qua
            if (!event.data) return;
            console.log('📦 Dữ liệu thô từ Backend gửi qua SSE:', event.data);
            if (event.data === 'Notification SSE connected') {
              console.log('✅ Đã kết nối ống nước SSE thành công!');
              return; // Dừng lại ở đây, không parse JSON câu này
            }
            try {
              const newNotification: NotificationItem = JSON.parse(event.data);

              // Nhồi thông báo mới vào đầu danh sách cache
              queryClient.setQueryData(
                ['notifications', 'me'],
                (oldData: NotificationItem[] | undefined) => {
                  return oldData ? [newNotification, ...oldData] : [newNotification];
                },
              );

              // Tăng số lượng chưa đọc lên 1
              queryClient.setQueryData(
                ['notifications', 'unread-count'],
                (old: number | undefined) => (old ?? 0) + 1,
              );
            } catch (error) {
              console.error('Lỗi khi parse dữ liệu SSE:', error);
            }
          },

          // Xử lý khi có lỗi (VD: token hết hạn, mất mạng)
          onerror(error) {
            console.error('Lỗi kết nối SSE stream:', error);
            // Bắt buộc ném lỗi ra ngoài để thư viện tự ngắt/thử lại
            throw error;
          },
        });
      } catch (err) {
        console.error('Không thể khởi tạo luồng SSE:', err);
      }
    };

    connectStream();

    // Dọn dẹp: Hủy kết nối khi user chuyển trang, đăng xuất hoặc Component bị tháo gỡ
    return () => {
      ctrl.abort();
    };
  }, [queryClient]); // Xóa token khỏi mảng dependency để tránh render lại liên tục nếu token đổi
};
