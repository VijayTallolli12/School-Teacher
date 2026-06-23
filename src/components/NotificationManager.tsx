import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { useQueryClient } from '@tanstack/react-query';
import { notificationQueryKeys, useUnreadCount } from '../hooks/useNotifications';
import { notificationsApi } from '../api/notifications';
import { registerForPushNotifications } from '../services/pushNotifications';

export const NotificationManager: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: unreadCount } = useUnreadCount();

  useEffect(() => {
    registerForPushNotifications().catch((error) => {
      console.warn('Push notification registration failed:', error);
    });

    if (Platform.OS === 'web') return;

    const receivedSubscription = Notifications.addNotificationReceivedListener(() => {
      queryClient.invalidateQueries({ queryKey: notificationQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: notificationQueryKeys.unreadCount });
    });

    const responseSubscription = Notifications.addNotificationResponseReceivedListener(() => {
      queryClient.invalidateQueries({ queryKey: notificationQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: notificationQueryKeys.unreadCount });
    });

    const tokenSubscription = Notifications.addPushTokenListener((deviceToken) => {
      if (Platform.OS !== 'android' && Platform.OS !== 'ios') return;

      notificationsApi
        .registerDevice({
          device_type: 'mobile',
          platform: Platform.OS,
          device_token: String(deviceToken.data),
        })
        .catch((error) => {
          console.warn('Push token refresh registration failed:', error);
        });
    });

    return () => {
      receivedSubscription.remove();
      responseSubscription.remove();
      tokenSubscription.remove();
    };
  }, [queryClient]);

  useEffect(() => {
    if (typeof unreadCount === 'number' && Platform.OS !== 'web') {
      Notifications.setBadgeCountAsync(unreadCount).catch(() => undefined);
    }
  }, [unreadCount]);

  return null;
};
