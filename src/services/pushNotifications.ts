import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { notificationsApi } from '../api/notifications';

export const NOTIFICATION_CHANNEL_ID = 'teacher-updates';

if (Platform.OS !== 'web') {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: true,
      shouldSetBadge: true,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

export const registerForPushNotifications = async (): Promise<string | null> => {
  if (Platform.OS === 'web') {
    return null;
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(NOTIFICATION_CHANNEL_ID, {
      name: 'Teacher updates',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#4F46E5',
    });
  }

  const currentPermissions = await Notifications.getPermissionsAsync();
  const permissionStatus =
    currentPermissions.status === 'granted'
      ? currentPermissions.status
      : (await Notifications.requestPermissionsAsync()).status;

  if (permissionStatus !== 'granted') {
    return null;
  }

  const deviceToken = await Notifications.getDevicePushTokenAsync();

  if (Platform.OS !== 'android' && Platform.OS !== 'ios') {
    return null;
  }

  const token = String(deviceToken.data);
  await notificationsApi.registerDevice({
    device_type: 'mobile',
    platform: Platform.OS,
    device_token: token,
  });
  return token;
};
