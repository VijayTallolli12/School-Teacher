import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SETTINGS_KEYS = {
  THEME: 'pref_theme',
  PUSH_NOTIFICATIONS: 'pref_push_notifications',
  EMAIL_NOTIFICATIONS: 'pref_email_notifications',
  SMS_NOTIFICATIONS: 'pref_sms_notifications',
} as const;

interface SettingsState {
  theme: 'light' | 'dark';
  pushNotifications: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  isLoading: boolean;

  setTheme: (theme: 'light' | 'dark') => Promise<void>;
  setPushNotifications: (enabled: boolean) => Promise<void>;
  setEmailNotifications: (enabled: boolean) => Promise<void>;
  setSmsNotifications: (enabled: boolean) => Promise<void>;
  loadPreferences: () => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  theme: 'light',
  pushNotifications: true,
  emailNotifications: true,
  smsNotifications: false,
  isLoading: true,

  setTheme: async (theme) => {
    await AsyncStorage.setItem(SETTINGS_KEYS.THEME, theme);
    set({ theme });
  },

  setPushNotifications: async (enabled) => {
    await AsyncStorage.setItem(SETTINGS_KEYS.PUSH_NOTIFICATIONS, String(enabled));
    set({ pushNotifications: enabled });
  },

  setEmailNotifications: async (enabled) => {
    await AsyncStorage.setItem(SETTINGS_KEYS.EMAIL_NOTIFICATIONS, String(enabled));
    set({ emailNotifications: enabled });
  },

  setSmsNotifications: async (enabled) => {
    await AsyncStorage.setItem(SETTINGS_KEYS.SMS_NOTIFICATIONS, String(enabled));
    set({ smsNotifications: enabled });
  },

  loadPreferences: async () => {
    try {
      const [theme, push, email, sms] = await Promise.all([
        AsyncStorage.getItem(SETTINGS_KEYS.THEME),
        AsyncStorage.getItem(SETTINGS_KEYS.PUSH_NOTIFICATIONS),
        AsyncStorage.getItem(SETTINGS_KEYS.EMAIL_NOTIFICATIONS),
        AsyncStorage.getItem(SETTINGS_KEYS.SMS_NOTIFICATIONS),
      ]);

      set({
        theme: theme === 'dark' ? 'dark' : 'light',
        pushNotifications: push !== 'false',
        emailNotifications: email !== 'false',
        smsNotifications: sms === 'true',
        isLoading: false,
      });
    } catch {
      set({ isLoading: false });
    }
  },
}));
