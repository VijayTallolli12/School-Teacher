import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  TEACHER_PROFILE: 'teacher_profile',
} as const;

export const storage = {
  async setToken(token: string): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
  },

  async getToken(): Promise<string | null> {
    return await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  },

  async removeToken(): Promise<void> {
    await AsyncStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  },

  async setProfile(profile: string): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.TEACHER_PROFILE, profile);
  },

  async getProfile(): Promise<string | null> {
    return await AsyncStorage.getItem(STORAGE_KEYS.TEACHER_PROFILE);
  },

  async removeProfile(): Promise<void> {
    await AsyncStorage.removeItem(STORAGE_KEYS.TEACHER_PROFILE);
  },

  async clearAll(): Promise<void> {
    await this.removeToken();
    await this.removeProfile();
  },
};
