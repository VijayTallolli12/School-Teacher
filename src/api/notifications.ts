import apiClient from '../utils/axios';
import {
  NotificationMutationResponse,
  NotificationResponse,
  RegisterDevicePayload,
  RegisterDeviceResponse,
  UnreadCountResponse,
} from '../types';

const NOTIFICATIONS_PATH = '/api/v1/teacher/notifications';
const SHARED_NOTIFICATIONS_PATH = '/api/v1/notifications';
const DEVICES_PATH = '/api/v1/devices';

export const notificationsApi = {
  async getNotifications(): Promise<NotificationResponse> {
    const response = await apiClient.get<NotificationResponse>(NOTIFICATIONS_PATH);
    return response.data;
  },

  async markAsRead(notificationId: string): Promise<NotificationMutationResponse> {
    const response = await apiClient.post<NotificationMutationResponse>(
      `${NOTIFICATIONS_PATH}/${notificationId}/read`,
    );
    return response.data;
  },

  async markAllAsRead(): Promise<NotificationMutationResponse> {
    const response = await apiClient.post<NotificationMutationResponse>(
      `${NOTIFICATIONS_PATH}/read-all`,
    );
    return response.data;
  },

  async getUnreadCount(): Promise<UnreadCountResponse> {
    const response = await apiClient.get<UnreadCountResponse>(
      `${SHARED_NOTIFICATIONS_PATH}/unread-count`,
    );
    return response.data;
  },

  async registerDevice(payload: RegisterDevicePayload): Promise<RegisterDeviceResponse> {
    const response = await apiClient.post<RegisterDeviceResponse>(
      `${DEVICES_PATH}/register`,
      payload,
    );
    return response.data;
  },
};
