import { api } from '@/lib/axios';
import type { BaseResponse } from '@/types/base-response';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { NotificationItem } from '../types';

export const useNotifications = () => {
  const queryClient = useQueryClient();

  // 1. Lấy danh sách thông báo
  const notificationsQuery = useQuery({
    queryKey: ['notifications', 'me'],
    queryFn: async () => {
      const { data } = await api.get<BaseResponse<NotificationItem[]>>('/notifications/me');
      return data.result;
    },
  });

  // 2. Lấy số lượng chưa đọc
  const unreadCountQuery = useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: async () => {
      const { data } = await api.get<BaseResponse<{ unreadCount: number }>>(
        '/notifications/me/unread-count',
      );
      return data.result.unreadCount;
    },
  });

  // 3. Mutation: Đánh dấu đã đọc tất cả
  const readAllMutation = useMutation({
    mutationFn: () => api.patch('/notifications/me/read-all'),
    onMutate: async () => {
      // 🌟 Lạc quan: Đánh dấu tất cả là đã đọc ngay lập tức
      await queryClient.cancelQueries({ queryKey: ['notifications'] });

      queryClient.setQueryData(
        ['notifications', 'me'],
        (oldData: NotificationItem[] | undefined) => {
          if (!oldData) return [];
          return oldData.map((item) => ({ ...item, read: true, isRead: true }));
        },
      );
      queryClient.setQueryData(['notifications', 'unread-count'], 0);
    },
    onSettled: () => {
      // Đảm bảo sync lại với server cho chắc ăn
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  // 4. Mutation: Đánh dấu đã đọc MỘT tin nhắn cụ thể (Đã thêm Optimistic Update)
  const readSingleMutation = useMutation({
    mutationFn: (id: string) => api.patch(`/notifications/${id}/read`),

    // 🌟 onMutate chạy ngay lập tức khi bạn gọi readSingle(id), KHÔNG CHỜ API
    onMutate: async (clickedId: string) => {
      // Dừng mọi request fetch data đang dở dang để tránh nó ghi đè lên data mình sắp sửa
      await queryClient.cancelQueries({ queryKey: ['notifications'] });

      // Lưu lại data cũ để phòng hờ gọi API lỗi thì Rollback (khôi phục)
      const previousNotifications = queryClient.getQueryData<NotificationItem[]>([
        'notifications',
        'me',
      ]);
      const previousUnreadCount = queryClient.getQueryData<number>([
        'notifications',
        'unread-count',
      ]);

      // 🌟 SỬA CACHE LUÔN VÀ NGAY
      // 1. Cập nhật danh sách: Tìm đúng thằng đang click và cho read = true
      queryClient.setQueryData(
        ['notifications', 'me'],
        (oldData: NotificationItem[] | undefined) => {
          if (!oldData) return [];
          return oldData.map((item) =>
            item.id === clickedId ? { ...item, read: true, isRead: true } : item,
          );
        },
      );

      // 2. Cập nhật số đếm: Trừ đi 1
      queryClient.setQueryData(['notifications', 'unread-count'], (old: number | undefined) => {
        return Math.max(0, (old ?? 0) - 1);
      });

      // Trả về data cũ để nhỡ lỗi thì đưa xuống hàm onError xài
      return { previousNotifications, previousUnreadCount };
    },

    // 🌟 Nếu lỡ rớt mạng hoặc Backend văng lỗi -> Trả lại trạng thái cũ cho user
    onError: (_err, _newTodo, context) => {
      if (context?.previousNotifications) {
        queryClient.setQueryData(['notifications', 'me'], context.previousNotifications);
      }
      if (context?.previousUnreadCount !== undefined) {
        queryClient.setQueryData(['notifications', 'unread-count'], context.previousUnreadCount);
      }
    },

    // 🌟 Chạy xong hết (dù thành công hay lỗi) thì vẫn gọi fetch nhẹ lại một phát để chốt data với server
    onSettled: () => {
      // UI không bị giật vì data trong Cache đã đúng rồi, nó chỉ chạy ngầm thôi
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  return {
    notifications: notificationsQuery.data ?? [],
    unreadCount: unreadCountQuery.data ?? 0,
    isLoading: notificationsQuery.isLoading,
    readAll: readAllMutation.mutate,
    readSingle: readSingleMutation.mutate,
  };
};
