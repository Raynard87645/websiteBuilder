export interface User {
  id: number;
  username: string;
  email: string;
  created_at: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
}

export interface ChatRoom {
  id: number;
  name: string;
  type: 'private' | 'group';
  created_by: number;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: number;
  room_id: number;
  user_id: number;
  content: string;
  created_at: string;
  username: string;
}

export interface CreateRoomData {
  name: string;
  type: 'private' | 'group';
  participants?: number[];
}

export interface SendMessageData {
  content: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface SocketUser {
  id: number;
  username: string;
  socketId: string;
}

// Socket event types
export interface SocketEvents {
  // Client to server
  join_room: { roomId: number };
  leave_room: { roomId: number };
  send_message: { roomId: number; content: string };
  typing_start: { roomId: number };
  typing_stop: { roomId: number };
  get_online_users: { roomId: number };

  // Server to client
  new_message: { roomId: number; message: Message };
  user_joined_room: { roomId: number; user: { id: number; username: string } };
  user_left_room: { roomId: number; user: { id: number; username: string } };
  user_typing: { roomId: number; user: { id: number; username: string } };
  user_stopped_typing: { roomId: number; user: { id: number; username: string } };
  user_online: { userId: number; username: string };
  user_offline: { userId: number; username: string };
  online_users: { roomId: number; users: SocketUser[] };
  joined_room: { roomId: number };
  left_room: { roomId: number };
  message_sent: { message: Message };
  error: { type: string; message: string };
}