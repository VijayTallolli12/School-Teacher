/**
 * Centralized API Client
 *
 * Single Axios instance shared across all API service modules.
 * Uses base URL from environment configuration.
 *
 * @see src/config/env.ts
 */

import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { ENV } from './env';

export const apiClient: AxiosInstance = axios.create({
  baseURL: ENV.API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error retrieving token from storage:', error);
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    if (error.response) {
      const status = error.response.status;

      if (status === 401) {
        // Session expired / invalid — clear credentials and return the user
        // to the login screen. Only redirect when a real session existed
        // (a failed login attempt must not bounce the user around).
        const hadToken = await AsyncStorage.getItem('access_token');
        await AsyncStorage.removeItem('access_token');
        await AsyncStorage.removeItem('teacher_profile');
        if (hadToken) {
          router.replace('/(auth)/login');
        }
      }
    } else if (error.request) {
      console.error('Network error:', error.message);
    } else {
      console.error('Request setup error:', error.message);
    }

    return Promise.reject(error);
  }
);

export default apiClient;
