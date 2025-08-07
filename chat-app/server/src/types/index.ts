export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  created_at: Date;
  updated_at: Date;
}

export interface UserResponse {
  id: number;
  username: string;
  email: string;
  created_at: Date;
}

export interface ChatRoom {
  id: number;
  name: string;
  type: 'private' | 'group';
  created_by: number;
  created_at: Date;
  updated_at: Date;
}

export interface Message {
  id: number;
  room_id: number;
  user_id: number;
  content: string;
  created_at: Date;
}

export interface MessageResponse extends Message {
  username: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface JWTPayload {
  userId: number;
  username: string;
  email: string;
}

export interface SocketUser {
  id: number;
  username: string;
  socketId: string;
}

export interface CreateRoomRequest {
  name: string;
  type: 'private' | 'group';
  participants?: number[];
}

export interface SendMessageRequest {
  content: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}