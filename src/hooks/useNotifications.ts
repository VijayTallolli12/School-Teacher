import {
  UseMutationResult,
  UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { notificationsApi } from '../api/notifications';
import { CreateAlertPayload, NotificationItem, NotificationMutationResponse } from '../types';

const mapNotificationType = (type: string, title: string): NotificationItem['type'] => {
  const source = `${type} ${title}`.toLowerCase();
  if (source.includes('attendance')) return 'attendance';
  if (source.includes('homework')) return 'homework';
  if (source.includes('exam')) return 'exam';
  if (source.includes('fee')) return 'fee';
  if (source.includes('transport')) return 'transport';
  if (source.includes('agent') || source.includes('ai ')) return 'ai_agent';
  return 'system';
};

export const notificationQueryKeys = {
  all: ['notifications'] as const,
  unreadCount: ['notifications', 'unread-count'] as const,
};

export const useNotifications = (): UseQueryResult<NotificationItem[], Error> =>
  useQuery({
    queryKey: notificationQueryKeys.all,
    queryFn: async () => {
      const response = await notificationsApi.getNotifications();
      return (response.data?.notifications ?? []).map((notification) => ({
        id: String(notification.id),
        title: notification.title,
        message: notification.message,
        type: mapNotificationType(notification.type, notification.title),
        createdAt: notification.sent_at ?? '',
        isRead: notification.is_read,
        readAt: notification.read_at,
        data: {
          sourceType: notification.type,
          typeLabel: notification.type_label,
          priority: notification.priority,
        },
      }));
    },
    staleTime: 30 * 1000,
  });

export const useUnreadCount = (): UseQueryResult<number, Error> =>
  useQuery({
    queryKey: notificationQueryKeys.unreadCount,
    queryFn: async () => (await notificationsApi.getUnreadCount())?.data?.unread_count ?? 0,
    staleTime: 30 * 1000,
  });

export const useMarkAsRead = (): UseMutationResult<
  NotificationMutationResponse,
  Error,
  string
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: notificationsApi.markAsRead,
    onSuccess: (_, notificationId) => {
      queryClient.setQueryData<NotificationItem[]>(
        notificationQueryKeys.all,
        (notifications) =>
          notifications?.map((notification) =>
            notification.id === notificationId
              ? { ...notification, isRead: true, readAt: new Date().toISOString() }
              : notification,
          ),
      );
      queryClient.setQueryData<number>(
        notificationQueryKeys.unreadCount,
        (count) => Math.max(0, (count ?? 1) - 1),
      );
      queryClient.invalidateQueries({ queryKey: notificationQueryKeys.unreadCount });
    },
  });
};

export const useCreateAlert = (): UseMutationResult<
  { success: boolean; message: string },
  Error,
  CreateAlertPayload
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: notificationsApi.createAlert,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationQueryKeys.all });
    },
  });
};

export const useMarkAllAsRead = (): UseMutationResult<
  NotificationMutationResponse,
  Error,
  void
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: notificationsApi.markAllAsRead,
    onSuccess: () => {
      queryClient.setQueryData<NotificationItem[]>(
        notificationQueryKeys.all,
        (notifications) =>
          notifications?.map((notification) => ({
            ...notification,
            isRead: true,
            readAt: notification.readAt ?? new Date().toISOString(),
          })),
      );
      queryClient.setQueryData(notificationQueryKeys.unreadCount, 0);
      queryClient.invalidateQueries({ queryKey: notificationQueryKeys.all });
    },
  });
};
