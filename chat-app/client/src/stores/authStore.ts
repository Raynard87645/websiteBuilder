import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, AuthTokens, LoginCredentials, RegisterCredentials } from '@/types';
import { authAPI } from '@/services/api';
import toast from 'react-hot-toast';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (credentials: RegisterCredentials) => Promise<boolean>;
  logout: () => Promise<void>;
  logoutAll: () => Promise<void>;
  checkAuth: () => Promise<void>;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true });
        try {
          const response = await authAPI.login(credentials);
          
          if (response.success && response.data) {
            const { user, tokens } = response.data;
            
            // Store tokens in localStorage
            localStorage.setItem('accessToken', tokens.accessToken);
            localStorage.setItem('refreshToken', tokens.refreshToken);
            
            set({ 
              user, 
              isAuthenticated: true, 
              isLoading: false 
            });
            
            toast.success('Login successful!');
            return true;
          } else {
            throw new Error(response.error || 'Login failed');
          }
        } catch (error: any) {
          const message = error.response?.data?.error || error.message || 'Login failed';
          toast.error(message);
          set({ isLoading: false });
          return false;
        }
      },

      register: async (credentials: RegisterCredentials) => {
        set({ isLoading: true });
        try {
          const response = await authAPI.register(credentials);
          
          if (response.success && response.data) {
            const { user, tokens } = response.data;
            
            // Store tokens in localStorage
            localStorage.setItem('accessToken', tokens.accessToken);
            localStorage.setItem('refreshToken', tokens.refreshToken);
            
            set({ 
              user, 
              isAuthenticated: true, 
              isLoading: false 
            });
            
            toast.success('Registration successful!');
            return true;
          } else {
            throw new Error(response.error || 'Registration failed');
          }
        } catch (error: any) {
          const message = error.response?.data?.error || error.message || 'Registration failed';
          toast.error(message);
          set({ isLoading: false });
          return false;
        }
      },

      logout: async () => {
        try {
          const refreshToken = localStorage.getItem('refreshToken');
          if (refreshToken) {
            await authAPI.logout(refreshToken);
          }
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          // Clear tokens and state
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          
          set({ 
            user: null, 
            isAuthenticated: false, 
            isLoading: false 
          });
          
          toast.success('Logged out successfully');
        }
      },

      logoutAll: async () => {
        try {
          await authAPI.logoutAll();
        } catch (error) {
          console.error('Logout all error:', error);
        } finally {
          // Clear tokens and state
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          
          set({ 
            user: null, 
            isAuthenticated: false, 
            isLoading: false 
          });
          
          toast.success('Logged out from all devices');
        }
      },

      checkAuth: async () => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          set({ isAuthenticated: false, user: null });
          return;
        }

        set({ isLoading: true });
        try {
          const response = await authAPI.getProfile();
          
          if (response.success && response.data) {
            set({ 
              user: response.data, 
              isAuthenticated: true, 
              isLoading: false 
            });
          } else {
            throw new Error('Profile fetch failed');
          }
        } catch (error) {
          console.error('Auth check failed:', error);
          // Clear invalid tokens
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          
          set({ 
            user: null, 
            isAuthenticated: false, 
            isLoading: false 
          });
        }
      },

      setUser: (user: User | null) => {
        set({ user, isAuthenticated: !!user });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);