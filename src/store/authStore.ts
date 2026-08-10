import { create } from 'zustand';
import { User } from '../types';
import { authApi, LoginRequest } from '../api/auth';
import { storage } from '../utils/storage';

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  restoreSession: () => Promise<void>;
  clearError: () => void;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  isAuthenticated: false,
  user: null,
  token: null,
  isLoading: false,
  error: null,

  login: async (credentials: LoginRequest) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authApi.login(credentials);
      
      // Store token and profile
      await storage.setToken(response.token);
      await storage.setProfile(JSON.stringify(response.user));
      
      set({
        isAuthenticated: true,
        user: response.user,
        token: response.token,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      let errorMessage = 'Login failed';
      
      if (error.response) {
        if (error.response.status === 401) {
          errorMessage = 'Invalid email or password';
        } else if (error.response.status === 500) {
          errorMessage = 'Server error. Please try again later';
        } else {
          errorMessage = error.response.data?.message || 'Login failed';
        }
      } else if (error.request) {
        errorMessage = 'Network error. Please check your connection';
      }
      
      set({
        isAuthenticated: false,
        user: null,
        token: null,
        isLoading: false,
        error: errorMessage,
      });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      // Call logout API
      await authApi.logout();
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      // Clear local storage regardless of API call result
      await storage.clearAll();
      
      set({
        isAuthenticated: false,
        user: null,
        token: null,
        isLoading: false,
        error: null,
      });
    }
  },

  restoreSession: async () => {
    set({ isLoading: true });
    try {
      const token = await storage.getToken();
      const profileJson = await storage.getProfile();
      
      if (token && profileJson) {
        // Verify token is still valid by fetching profile
        try {
          const response = await authApi.getProfile();
          const savedUser = JSON.parse(profileJson) as User;
          
          set({
            isAuthenticated: true,
            user: {
              ...response.user,
              schoolId: response.user.schoolId || savedUser.schoolId,
            },
            token: token,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          // Token is invalid, clear storage
          await storage.clearAll();
          set({
            isAuthenticated: false,
            user: null,
            token: null,
            isLoading: false,
            error: null,
          });
        }
      } else {
        set({
          isAuthenticated: false,
          user: null,
          token: null,
          isLoading: false,
          error: null,
        });
      }
    } catch (error) {
      console.error('Session restore error:', error);
      await storage.clearAll();
      set({
        isAuthenticated: false,
        user: null,
        token: null,
        isLoading: false,
        error: null,
      });
    }
  },

  clearError: () => {
    set({ error: null });
  },

  setUser: (user: User) => {
    set({ user });
  },
}));
