import { ChatRoomModel } from '../models/ChatRoom';
import { MessageModel } from '../models/Message';
import { UserModel } from '../models/User';
import { redisPublisher } from '../config/redis';
import { ChatRoom, MessageResponse, CreateRoomRequest } from '../types';

export class ChatService {
  static async createRoom(userId: number, roomData: CreateRoomRequest): Promise<ChatRoom> {
    const { name, type, participants = [] } = roomData;

    // For private rooms, ensure there are exactly 2 participants
    if (type === 'private') {
      if (participants.length !== 1) {
        throw new Error('Private rooms must have exactly one other participant');
      }
      
      // Check if private room already exists between these users
      const existingRoom = await ChatRoomModel.findPrivateRoom(userId, participants[0]);
      if (existingRoom) {
        return existingRoom;
      }
    }

    // Create the room
    const room = await ChatRoomModel.create(name, type, userId);

    // Add creator as participant
    await ChatRoomModel.addParticipant(room.id, userId);

    // Add other participants
    for (const participantId of participants) {
      await ChatRoomModel.addParticipant(room.id, participantId);
    }

    return room;
  }

  static async joinRoom(roomId: number, userId: number): Promise<void> {
    const room = await ChatRoomModel.findById(roomId);
    if (!room) {
      throw new Error('Room not found');
    }

    // For private rooms, check if user is invited
    if (room.type === 'private') {
      const participants = await ChatRoomModel.getParticipants(roomId);
      if (!participants.includes(userId)) {
        throw new Error('You are not invited to this private room');
      }
    }

    await ChatRoomModel.addParticipant(roomId, userId);
  }

  static async leaveRoom(roomId: number, userId: number): Promise<void> {
    await ChatRoomModel.removeParticipant(roomId, userId);
  }

  static async getUserRooms(userId: number): Promise<ChatRoom[]> {
    return await ChatRoomModel.findByUser(userId);
  }

  static async sendMessage(roomId: number, userId: number, content: string): Promise<MessageResponse> {
    // Verify user is participant of the room
    const participants = await ChatRoomModel.getParticipants(roomId);
    if (!participants.includes(userId)) {
      throw new Error('You are not a participant of this room');
    }

    // Create message
    const message = await MessageModel.create(roomId, userId, content);

    // Update room activity
    await ChatRoomModel.updateActivity(roomId);

    // Publish message to Redis for real-time delivery
    await this.publishMessage(roomId, message);

    return message;
  }

  static async getMessages(roomId: number, userId: number, limit: number = 50, offset: number = 0): Promise<MessageResponse[]> {
    // Verify user is participant of the room
    const participants = await ChatRoomModel.getParticipants(roomId);
    if (!participants.includes(userId)) {
      throw new Error('You are not a participant of this room');
    }

    return await MessageModel.findByRoom(roomId, limit, offset);
  }

  static async getRoomParticipants(roomId: number, userId: number): Promise<any[]> {
    // Verify user is participant of the room
    const participants = await ChatRoomModel.getParticipants(roomId);
    if (!participants.includes(userId)) {
      throw new Error('You are not a participant of this room');
    }

    // Get participant details
    const participantDetails = [];
    for (const participantId of participants) {
      const user = await UserModel.findById(participantId);
      if (user) {
        participantDetails.push(user);
      }
    }

    return participantDetails;
  }

  static async deleteMessage(messageId: number, userId: number): Promise<void> {
    const success = await MessageModel.deleteMessage(messageId, userId);
    if (!success) {
      throw new Error('Message not found or you do not have permission to delete it');
    }
  }

  static async findOrCreatePrivateRoom(user1Id: number, user2Id: number): Promise<ChatRoom> {
    // Check if room already exists
    let room = await ChatRoomModel.findPrivateRoom(user1Id, user2Id);
    
    if (!room) {
      // Create new private room
      const user2 = await UserModel.findById(user2Id);
      if (!user2) {
        throw new Error('User not found');
      }
      
      room = await this.createRoom(user1Id, {
        name: `Private chat with ${user2.username}`,
        type: 'private',
        participants: [user2Id]
      });
    }

    return room;
  }

  private static async publishMessage(roomId: number, message: MessageResponse): Promise<void> {
    const messageData = {
      type: 'new_message',
      roomId,
      message
    };

    await redisPublisher.publish(`room:${roomId}`, JSON.stringify(messageData));
  }

  static async searchUsers(query: string, currentUserId: number): Promise<any[]> {
    const users = await UserModel.getAllUsers();
    return users
      .filter(user => 
        user.id !== currentUserId && 
        (user.username.toLowerCase().includes(query.toLowerCase()) || 
         user.email.toLowerCase().includes(query.toLowerCase()))
      )
      .slice(0, 10); // Limit results
  }
}