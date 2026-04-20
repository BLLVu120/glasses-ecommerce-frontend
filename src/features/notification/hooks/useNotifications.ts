import { api } from '@/lib/axios';
import type { BaseResponse } from '@/types/base-response';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { NotificationItem } from '../types';

export const useNotifications = () => {
  const queryClient = useQueryClient();

  const notificationsQuery = useQuery({
    queryKey: ['notifications', 'me'],
    queryFn: async () => {
      const { data } = await api.get<BaseResponse<NotificationItem[]>>('/notifications/me');
      return data.result;
    },
  });

  const unreadCountQuery = useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: async () => {
      const { data } = await api.get<BaseResponse<{ unreadCount: number }>>(
        '/notifications/me/unread-count',
      );
      return data.result.unreadCount;
    },
  });

  const readAllMutation = useMutation({
    mutationFn: () => api.patch('/notifications/me/read-all'),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['notifications'] });

      queryClient.setQueryData(['notifications', 'me'], (oldData: NotificationItem[] | undefined) => {
        if (!oldData) return [];
        return oldData.map((item) => ({ ...item, read: true, isRead: true }));
      });

      queryClient.setQueryData(['notifications', 'unread-count'], 0);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const readSingleMutation = useMutation({
    mutationFn: (id: string) => api.patch(`/notifications/${id}/read`),
    onMutate: async (clickedId: string) => {
      await queryClient.cancelQueries({ queryKey: ['notifications'] });

      const previousNotifications = queryClient.getQueryData<NotificationItem[]>([
        'notifications',
        'me',
      ]);
      const previousUnreadCount = queryClient.getQueryData<number>([
        'notifications',
        'unread-count',
      ]);

      queryClient.setQueryData(['notifications', 'me'], (oldData: NotificationItem[] | undefined) => {
        if (!oldData) return [];
        return oldData.map((item) =>
          item.id === clickedId ? { ...item, read: true, isRead: true } : item,
        );
      });

      queryClient.setQueryData(['notifications', 'unread-count'], (old: number | undefined) => {
        return Math.max(0, (old ?? 0) - 1);
      });

      return { previousNotifications, previousUnreadCount };
    },
    onError: (_err, _id, context) => {
      if (context?.previousNotifications) {
        queryClient.setQueryData(['notifications', 'me'], context.previousNotifications);
      }
      if (context?.previousUnreadCount !== undefined) {
        queryClient.setQueryData(['notifications', 'unread-count'], context.previousUnreadCount);
      }
    },
    onSettled: () => {
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