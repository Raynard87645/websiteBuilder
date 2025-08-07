import { create } from 'zustand';
import { ChatRoom, Message, User, SocketUser } from '@/types';
import { chatAPI } from '@/services/api';
import toast from 'react-hot-toast';

interface ChatState {
  // State
  rooms: ChatRoom[];
  messages: Record<number, Message[]>;
  activeRoom: ChatRoom | null;
  onlineUsers: SocketUser[];
  typingUsers: Record<number, { id: number; username: string }[]>;
  isLoading: boolean;
  
  // Actions
  setRooms: (rooms: ChatRoom[]) => void;
  setActiveRoom: (room: ChatRoom | null) => void;
  addRoom: (room: ChatRoom) => void;
  removeRoom: (roomId: number) => void;
  
  setMessages: (roomId: number, messages: Message[]) => void;
  addMessage: (roomId: number, message: Message) => void;
  removeMessage: (roomId: number, messageId: number) => void;
  
  setOnlineUsers: (users: SocketUser[]) => void;
  addOnlineUser: (user: SocketUser) => void;
  removeOnlineUser: (userId: number) => void;
  
  setTypingUsers: (roomId: number, users: { id: number; username: string }[]) => void;
  addTypingUser: (roomId: number, user: { id: number; username: string }) => void;
  removeTypingUser: (roomId: number, userId: number) => void;
  
  // API Actions
  fetchRooms: () => Promise<void>;
  fetchMessages: (roomId: number) => Promise<void>;
  createRoom: (name: string, type: 'private' | 'group', participants?: number[]) => Promise<ChatRoom | null>;
  createPrivateRoom: (targetUserId: number) => Promise<ChatRoom | null>;
  joinRoom: (roomId: number) => Promise<boolean>;
  leaveRoom: (roomId: number) => Promise<boolean>;
  sendMessage: (roomId: number, content: string) => Promise<Message | null>;
  deleteMessage: (roomId: number, messageId: number) => Promise<boolean>;
  searchUsers: (query: string) => Promise<User[]>;
  
  setLoading: (loading: boolean) => void;
  clearStore: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  // Initial state
  rooms: [],
  messages: {},
  activeRoom: null,
  onlineUsers: [],
  typingUsers: {},
  isLoading: false,

  // Basic state setters
  setRooms: (rooms: ChatRoom[]) => set({ rooms }),
  
  setActiveRoom: (room: ChatRoom | null) => set({ activeRoom: room }),
  
  addRoom: (room: ChatRoom) => set((state) => ({
    rooms: [...state.rooms, room],
  })),
  
  removeRoom: (roomId: number) => set((state) => ({
    rooms: state.rooms.filter(room => room.id !== roomId),
    messages: Object.fromEntries(
      Object.entries(state.messages).filter(([id]) => parseInt(id) !== roomId)
    ),
    activeRoom: state.activeRoom?.id === roomId ? null : state.activeRoom,
  })),

  setMessages: (roomId: number, messages: Message[]) => set((state) => ({
    messages: { ...state.messages, [roomId]: messages },
  })),
  
  addMessage: (roomId: number, message: Message) => set((state) => ({
    messages: {
      ...state.messages,
      [roomId]: [...(state.messages[roomId] || []), message],
    },
  })),
  
  removeMessage: (roomId: number, messageId: number) => set((state) => ({
    messages: {
      ...state.messages,
      [roomId]: (state.messages[roomId] || []).filter(msg => msg.id !== messageId),
    },
  })),

  setOnlineUsers: (users: SocketUser[]) => set({ onlineUsers: users }),
  
  addOnlineUser: (user: SocketUser) => set((state) => ({
    onlineUsers: [...state.onlineUsers.filter(u => u.id !== user.id), user],
  })),
  
  removeOnlineUser: (userId: number) => set((state) => ({
    onlineUsers: state.onlineUsers.filter(user => user.id !== userId),
  })),

  setTypingUsers: (roomId: number, users: { id: number; username: string }[]) => set((state) => ({
    typingUsers: { ...state.typingUsers, [roomId]: users },
  })),
  
  addTypingUser: (roomId: number, user: { id: number; username: string }) => set((state) => ({
    typingUsers: {
      ...state.typingUsers,
      [roomId]: [...(state.typingUsers[roomId] || []).filter(u => u.id !== user.id), user],
    },
  })),
  
  removeTypingUser: (roomId: number, userId: number) => set((state) => ({
    typingUsers: {
      ...state.typingUsers,
      [roomId]: (state.typingUsers[roomId] || []).filter(user => user.id !== userId),
    },
  })),

  // API Actions
  fetchRooms: async () => {
    set({ isLoading: true });
    try {
      const response = await chatAPI.getUserRooms();
      if (response.success && response.data) {
        set({ rooms: response.data });
      }
    } catch (error: any) {
      toast.error('Failed to fetch rooms');
      console.error('Fetch rooms error:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  fetchMessages: async (roomId: number) => {
    try {
      const response = await chatAPI.getMessages(roomId);
      if (response.success && response.data) {
        get().setMessages(roomId, response.data);
      }
    } catch (error: any) {
      toast.error('Failed to fetch messages');
      console.error('Fetch messages error:', error);
    }
  },

  createRoom: async (name: string, type: 'private' | 'group', participants?: number[]) => {
    try {
      const response = await chatAPI.createRoom({ name, type, participants });
      if (response.success && response.data) {
        get().addRoom(response.data);
        toast.success('Room created successfully');
        return response.data;
      }
      return null;
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to create room';
      toast.error(message);
      console.error('Create room error:', error);
      return null;
    }
  },

  createPrivateRoom: async (targetUserId: number) => {
    try {
      const response = await chatAPI.createPrivateRoom(targetUserId);
      if (response.success && response.data) {
        const existingRoom = get().rooms.find(room => room.id === response.data.id);
        if (!existingRoom) {
          get().addRoom(response.data);
        }
        return response.data;
      }
      return null;
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to create private room';
      toast.error(message);
      console.error('Create private room error:', error);
      return null;
    }
  },

  joinRoom: async (roomId: number) => {
    try {
      const response = await chatAPI.joinRoom(roomId);
      if (response.success) {
        toast.success('Joined room successfully');
        return true;
      }
      return false;
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to join room';
      toast.error(message);
      console.error('Join room error:', error);
      return false;
    }
  },

  leaveRoom: async (roomId: number) => {
    try {
      const response = await chatAPI.leaveRoom(roomId);
      if (response.success) {
        get().removeRoom(roomId);
        toast.success('Left room successfully');
        return true;
      }
      return false;
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to leave room';
      toast.error(message);
      console.error('Leave room error:', error);
      return false;
    }
  },

  sendMessage: async (roomId: number, content: string) => {
    try {
      const response = await chatAPI.sendMessage(roomId, { content });
      if (response.success && response.data) {
        // Message will be added via socket event
        return response.data;
      }
      return null;
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to send message';
      toast.error(message);
      console.error('Send message error:', error);
      return null;
    }
  },

  deleteMessage: async (roomId: number, messageId: number) => {
    try {
      const response = await chatAPI.deleteMessage(messageId);
      if (response.success) {
        get().removeMessage(roomId, messageId);
        toast.success('Message deleted');
        return true;
      }
      return false;
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to delete message';
      toast.error(message);
      console.error('Delete message error:', error);
      return false;
    }
  },

  searchUsers: async (query: string) => {
    try {
      const response = await chatAPI.searchUsers(query);
      if (response.success && response.data) {
        return response.data;
      }
      return [];
    } catch (error: any) {
      console.error('Search users error:', error);
      return [];
    }
  },

  setLoading: (loading: boolean) => set({ isLoading: loading }),
  
  clearStore: () => set({
    rooms: [],
    messages: {},
    activeRoom: null,
    onlineUsers: [],
    typingUsers: {},
    isLoading: false,
  }),
}));