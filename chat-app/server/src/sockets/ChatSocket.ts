import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { ChatService } from '../services/ChatService';
import { UserModel } from '../models/User';
import { redisSubscriber } from '../config/redis';
import { JWTPayload, SocketUser } from '../types';

export class ChatSocket {
  private io: Server;
  private connectedUsers: Map<number, SocketUser> = new Map();

  constructor(io: Server) {
    this.io = io;
    this.setupMiddleware();
    this.setupEventHandlers();
    this.setupRedisSubscription();
  }

  private setupMiddleware() {
    // Authentication middleware for Socket.IO
    this.io.use(async (socket: Socket, next) => {
      try {
        const token = socket.handshake.auth.token;
        if (!token) {
          throw new Error('Authentication token required');
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
        const user = await UserModel.findById(decoded.userId);
        
        if (!user) {
          throw new Error('User not found');
        }

        // Attach user info to socket
        socket.data.user = decoded;
        next();
      } catch (error) {
        next(new Error('Authentication failed'));
      }
    });
  }

  private setupEventHandlers() {
    this.io.on('connection', (socket: Socket) => {
      this.handleConnection(socket);
    });
  }

  private async handleConnection(socket: Socket) {
    const user = socket.data.user as JWTPayload;
    
    console.log(`User ${user.username} connected with socket ${socket.id}`);

    // Store connected user
    this.connectedUsers.set(user.userId, {
      id: user.userId,
      username: user.username,
      socketId: socket.id
    });

    // Join user to their rooms
    await this.joinUserRooms(socket, user.userId);

    // Handle socket events
    socket.on('join_room', (data) => this.handleJoinRoom(socket, data));
    socket.on('leave_room', (data) => this.handleLeaveRoom(socket, data));
    socket.on('send_message', (data) => this.handleSendMessage(socket, data));
    socket.on('typing_start', (data) => this.handleTypingStart(socket, data));
    socket.on('typing_stop', (data) => this.handleTypingStop(socket, data));
    socket.on('get_online_users', (data) => this.handleGetOnlineUsers(socket, data));

    socket.on('disconnect', () => this.handleDisconnection(socket));

    // Notify others that user is online
    socket.broadcast.emit('user_online', {
      userId: user.userId,
      username: user.username
    });
  }

  private async joinUserRooms(socket: Socket, userId: number) {
    try {
      const rooms = await ChatService.getUserRooms(userId);
      for (const room of rooms) {
        socket.join(`room:${room.id}`);
      }
    } catch (error) {
      console.error('Error joining user rooms:', error);
    }
  }

  private async handleJoinRoom(socket: Socket, data: { roomId: number }) {
    try {
      const user = socket.data.user as JWTPayload;
      const { roomId } = data;

      await ChatService.joinRoom(roomId, user.userId);
      socket.join(`room:${roomId}`);

      // Notify room members
      socket.to(`room:${roomId}`).emit('user_joined_room', {
        roomId,
        user: {
          id: user.userId,
          username: user.username
        }
      });

      socket.emit('joined_room', { roomId });
    } catch (error) {
      socket.emit('error', { 
        type: 'join_room_error',
        message: error instanceof Error ? error.message : 'Failed to join room'
      });
    }
  }

  private async handleLeaveRoom(socket: Socket, data: { roomId: number }) {
    try {
      const user = socket.data.user as JWTPayload;
      const { roomId } = data;

      await ChatService.leaveRoom(roomId, user.userId);
      socket.leave(`room:${roomId}`);

      // Notify room members
      socket.to(`room:${roomId}`).emit('user_left_room', {
        roomId,
        user: {
          id: user.userId,
          username: user.username
        }
      });

      socket.emit('left_room', { roomId });
    } catch (error) {
      socket.emit('error', { 
        type: 'leave_room_error',
        message: error instanceof Error ? error.message : 'Failed to leave room'
      });
    }
  }

  private async handleSendMessage(socket: Socket, data: { roomId: number; content: string }) {
    try {
      const user = socket.data.user as JWTPayload;
      const { roomId, content } = data;

      const message = await ChatService.sendMessage(roomId, user.userId, content);

      // Message will be broadcast via Redis pub/sub
      socket.emit('message_sent', { message });
    } catch (error) {
      socket.emit('error', { 
        type: 'send_message_error',
        message: error instanceof Error ? error.message : 'Failed to send message'
      });
    }
  }

  private handleTypingStart(socket: Socket, data: { roomId: number }) {
    const user = socket.data.user as JWTPayload;
    socket.to(`room:${data.roomId}`).emit('user_typing', {
      roomId: data.roomId,
      user: {
        id: user.userId,
        username: user.username
      }
    });
  }

  private handleTypingStop(socket: Socket, data: { roomId: number }) {
    const user = socket.data.user as JWTPayload;
    socket.to(`room:${data.roomId}`).emit('user_stopped_typing', {
      roomId: data.roomId,
      user: {
        id: user.userId,
        username: user.username
      }
    });
  }

  private handleGetOnlineUsers(socket: Socket, data: { roomId: number }) {
    const onlineUsers = Array.from(this.connectedUsers.values());
    socket.emit('online_users', {
      roomId: data.roomId,
      users: onlineUsers
    });
  }

  private handleDisconnection(socket: Socket) {
    const user = socket.data.user as JWTPayload;
    
    if (user) {
      console.log(`User ${user.username} disconnected`);
      
      // Remove from connected users
      this.connectedUsers.delete(user.userId);

      // Notify others that user is offline
      socket.broadcast.emit('user_offline', {
        userId: user.userId,
        username: user.username
      });
    }
  }

  private setupRedisSubscription() {
    // Subscribe to all room channels
    redisSubscriber.psubscribe('room:*');

    redisSubscriber.on('pmessage', (pattern: string, channel: string, message: string) => {
      try {
        const roomId = channel.split(':')[1];
        const data = JSON.parse(message);

        if (data.type === 'new_message') {
          // Broadcast message to room members
          this.io.to(`room:${roomId}`).emit('new_message', {
            roomId: parseInt(roomId),
            message: data.message
          });
        }
      } catch (error) {
        console.error('Error processing Redis message:', error);
      }
    });
  }

  // Public methods for external use
  public getUserSocket(userId: number): string | null {
    const user = this.connectedUsers.get(userId);
    return user ? user.socketId : null;
  }

  public getOnlineUsers(): SocketUser[] {
    return Array.from(this.connectedUsers.values());
  }

  public isUserOnline(userId: number): boolean {
    return this.connectedUsers.has(userId);
  }
}