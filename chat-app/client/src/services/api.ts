import axios, { AxiosResponse } from 'axios';
import { 
  ApiResponse, 
  LoginCredentials, 
  RegisterCredentials, 
  User, 
  AuthTokens,
  ChatRoom,
  Message,
  CreateRoomData,
  SendMessageData
} from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken,
          });

          const { accessToken, refreshToken: newRefreshToken } = response.data.data;
          
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', newRefreshToken);

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          // Refresh failed, redirect to login
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (credentials: LoginCredentials): Promise<ApiResponse<{ user: User; tokens: AuthTokens }>> => {
    const response: AxiosResponse<ApiResponse<{ user: User; tokens: AuthTokens }>> = await api.post('/auth/login', credentials);
    return response.data;
  },

  register: async (credentials: RegisterCredentials): Promise<ApiResponse<{ user: User; tokens: AuthTokens }>> => {
    const response: AxiosResponse<ApiResponse<{ user: User; tokens: AuthTokens }>> = await api.post('/auth/register', credentials);
    return response.data;
  },

  logout: async (refreshToken: string): Promise<ApiResponse> => {
    const response: AxiosResponse<ApiResponse> = await api.post('/auth/logout', { refreshToken });
    return response.data;
  },

  logoutAll: async (): Promise<ApiResponse> => {
    const response: AxiosResponse<ApiResponse> = await api.post('/auth/logout-all');
    return response.data;
  },

  getProfile: async (): Promise<ApiResponse<User>> => {
    const response: AxiosResponse<ApiResponse<User>> = await api.get('/auth/profile');
    return response.data;
  },

  refreshToken: async (refreshToken: string): Promise<ApiResponse<AuthTokens>> => {
    const response: AxiosResponse<ApiResponse<AuthTokens>> = await api.post('/auth/refresh', { refreshToken });
    return response.data;
  },
};

// Chat API
export const chatAPI = {
  // Rooms
  createRoom: async (roomData: CreateRoomData): Promise<ApiResponse<ChatRoom>> => {
    const response: AxiosResponse<ApiResponse<ChatRoom>> = await api.post('/chat/rooms', roomData);
    return response.data;
  },

  getUserRooms: async (): Promise<ApiResponse<ChatRoom[]>> => {
    const response: AxiosResponse<ApiResponse<ChatRoom[]>> = await api.get('/chat/rooms');
    return response.data;
  },

  joinRoom: async (roomId: number): Promise<ApiResponse> => {
    const response: AxiosResponse<ApiResponse> = await api.post(`/chat/rooms/${roomId}/join`);
    return response.data;
  },

  leaveRoom: async (roomId: number): Promise<ApiResponse> => {
    const response: AxiosResponse<ApiResponse> = await api.post(`/chat/rooms/${roomId}/leave`);
    return response.data;
  },

  getRoomParticipants: async (roomId: number): Promise<ApiResponse<User[]>> => {
    const response: AxiosResponse<ApiResponse<User[]>> = await api.get(`/chat/rooms/${roomId}/participants`);
    return response.data;
  },

  // Messages
  sendMessage: async (roomId: number, messageData: SendMessageData): Promise<ApiResponse<Message>> => {
    const response: AxiosResponse<ApiResponse<Message>> = await api.post(`/chat/rooms/${roomId}/messages`, messageData);
    return response.data;
  },

  getMessages: async (roomId: number, limit = 50, offset = 0): Promise<ApiResponse<Message[]>> => {
    const response: AxiosResponse<ApiResponse<Message[]>> = await api.get(`/chat/rooms/${roomId}/messages`, {
      params: { limit, offset },
    });
    return response.data;
  },

  deleteMessage: async (messageId: number): Promise<ApiResponse> => {
    const response: AxiosResponse<ApiResponse> = await api.delete(`/chat/messages/${messageId}`);
    return response.data;
  },

  // Private rooms
  createPrivateRoom: async (targetUserId: number): Promise<ApiResponse<ChatRoom>> => {
    const response: AxiosResponse<ApiResponse<ChatRoom>> = await api.post('/chat/rooms/private', { targetUserId });
    return response.data;
  },

  // User search
  searchUsers: async (query: string): Promise<ApiResponse<User[]>> => {
    const response: AxiosResponse<ApiResponse<User[]>> = await api.get('/chat/users/search', {
      params: { q: query },
    });
    return response.data;
  },
};

export default api;