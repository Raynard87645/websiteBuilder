import { Request, Response } from 'express';
import { ChatService } from '../services/ChatService';
import { ApiResponse, CreateRoomRequest, SendMessageRequest } from '../types';

export class ChatController {
  static async createRoom(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
      }

      const roomData: CreateRoomRequest = req.body;
      const room = await ChatService.createRoom(userId, roomData);

      const response: ApiResponse = {
        success: true,
        data: room,
        message: 'Room created successfully'
      };

      res.status(201).json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create room'
      };

      res.status(400).json(response);
    }
  }

  static async joinRoom(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
      }

      const roomId = parseInt(req.params.roomId);
      await ChatService.joinRoom(roomId, userId);

      const response: ApiResponse = {
        success: true,
        message: 'Joined room successfully'
      };

      res.status(200).json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to join room'
      };

      res.status(400).json(response);
    }
  }

  static async leaveRoom(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
      }

      const roomId = parseInt(req.params.roomId);
      await ChatService.leaveRoom(roomId, userId);

      const response: ApiResponse = {
        success: true,
        message: 'Left room successfully'
      };

      res.status(200).json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to leave room'
      };

      res.status(400).json(response);
    }
  }

  static async getUserRooms(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
      }

      const rooms = await ChatService.getUserRooms(userId);

      const response: ApiResponse = {
        success: true,
        data: rooms,
        message: 'Rooms retrieved successfully'
      };

      res.status(200).json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to retrieve rooms'
      };

      res.status(500).json(response);
    }
  }

  static async sendMessage(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
      }

      const roomId = parseInt(req.params.roomId);
      const { content }: SendMessageRequest = req.body;

      const message = await ChatService.sendMessage(roomId, userId, content);

      const response: ApiResponse = {
        success: true,
        data: message,
        message: 'Message sent successfully'
      };

      res.status(201).json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send message'
      };

      res.status(400).json(response);
    }
  }

  static async getMessages(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
      }

      const roomId = parseInt(req.params.roomId);
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;

      const messages = await ChatService.getMessages(roomId, userId, limit, offset);

      const response: ApiResponse = {
        success: true,
        data: messages,
        message: 'Messages retrieved successfully'
      };

      res.status(200).json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to retrieve messages'
      };

      res.status(400).json(response);
    }
  }

  static async getRoomParticipants(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
      }

      const roomId = parseInt(req.params.roomId);
      const participants = await ChatService.getRoomParticipants(roomId, userId);

      const response: ApiResponse = {
        success: true,
        data: participants,
        message: 'Participants retrieved successfully'
      };

      res.status(200).json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to retrieve participants'
      };

      res.status(400).json(response);
    }
  }

  static async deleteMessage(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
      }

      const messageId = parseInt(req.params.messageId);
      await ChatService.deleteMessage(messageId, userId);

      const response: ApiResponse = {
        success: true,
        message: 'Message deleted successfully'
      };

      res.status(200).json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete message'
      };

      res.status(400).json(response);
    }
  }

  static async createPrivateRoom(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
      }

      const { targetUserId } = req.body;
      if (!targetUserId) {
        return res.status(400).json({
          success: false,
          error: 'Target user ID is required'
        });
      }

      const room = await ChatService.findOrCreatePrivateRoom(userId, targetUserId);

      const response: ApiResponse = {
        success: true,
        data: room,
        message: 'Private room created or found successfully'
      };

      res.status(200).json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create private room'
      };

      res.status(400).json(response);
    }
  }

  static async searchUsers(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
      }

      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({
          success: false,
          error: 'Search query is required'
        });
      }

      const users = await ChatService.searchUsers(query, userId);

      const response: ApiResponse = {
        success: true,
        data: users,
        message: 'Users found successfully'
      };

      res.status(200).json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to search users'
      };

      res.status(500).json(response);
    }
  }
}