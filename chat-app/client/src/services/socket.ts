import { io, Socket } from 'socket.io-client';
import { SocketEvents } from '@/types';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';

class SocketService {
  private socket: Socket | null = null;
  private listeners: Map<string, Function[]> = new Map();

  connect(token: string) {
    if (this.socket?.connected) {
      return this.socket;
    }

    this.socket = io(SOCKET_URL, {
      auth: {
        token,
      },
      transports: ['websocket', 'polling'],
    });

    this.socket.on('connect', () => {
      console.log('Connected to server');
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Disconnected from server:', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
    });

    // Re-register all listeners
    this.listeners.forEach((callbacks, event) => {
      callbacks.forEach(callback => {
        this.socket?.on(event, callback);
      });
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  emit<K extends keyof SocketEvents>(event: K, data: SocketEvents[K]) {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    } else {
      console.warn('Socket not connected, cannot emit event:', event);
    }
  }

  on<K extends keyof SocketEvents>(
    event: K,
    callback: (data: SocketEvents[K]) => void
  ) {
    // Store the listener for re-registration on reconnect
    if (!this.listeners.has(event as string)) {
      this.listeners.set(event as string, []);
    }
    this.listeners.get(event as string)!.push(callback);

    if (this.socket) {
      this.socket.on(event as string, callback);
    }
  }

  off<K extends keyof SocketEvents>(
    event: K,
    callback?: (data: SocketEvents[K]) => void
  ) {
    if (callback) {
      // Remove specific callback
      const callbacks = this.listeners.get(event as string);
      if (callbacks) {
        const index = callbacks.indexOf(callback);
        if (index > -1) {
          callbacks.splice(index, 1);
        }
      }
    } else {
      // Remove all callbacks for this event
      this.listeners.delete(event as string);
    }

    if (this.socket) {
      if (callback) {
        this.socket.off(event as string, callback);
      } else {
        this.socket.off(event as string);
      }
    }
  }

  // Convenience methods for common events
  joinRoom(roomId: number) {
    this.emit('join_room', { roomId });
  }

  leaveRoom(roomId: number) {
    this.emit('leave_room', { roomId });
  }

  sendMessage(roomId: number, content: string) {
    this.emit('send_message', { roomId, content });
  }

  startTyping(roomId: number) {
    this.emit('typing_start', { roomId });
  }

  stopTyping(roomId: number) {
    this.emit('typing_stop', { roomId });
  }

  getOnlineUsers(roomId: number) {
    this.emit('get_online_users', { roomId });
  }

  // Check connection status
  get isConnected() {
    return this.socket?.connected || false;
  }

  get socketId() {
    return this.socket?.id;
  }
}

// Create singleton instance
export const socketService = new SocketService();
export default socketService;