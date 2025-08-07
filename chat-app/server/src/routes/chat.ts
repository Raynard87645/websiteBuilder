import { Router } from 'express';
import { ChatController } from '../controllers/ChatController';
import { authenticateToken } from '../middlewares/auth';
import { validateRequest, createRoomSchema, sendMessageSchema } from '../middlewares/validation';
import { messageLimiter, apiLimiter } from '../middlewares/rateLimiter';

const router = Router();

// All chat routes require authentication
router.use(authenticateToken);

// Room management
router.post('/rooms', apiLimiter, validateRequest(createRoomSchema), ChatController.createRoom);
router.get('/rooms', apiLimiter, ChatController.getUserRooms);
router.post('/rooms/:roomId/join', apiLimiter, ChatController.joinRoom);
router.post('/rooms/:roomId/leave', apiLimiter, ChatController.leaveRoom);
router.get('/rooms/:roomId/participants', apiLimiter, ChatController.getRoomParticipants);

// Message management
router.post('/rooms/:roomId/messages', messageLimiter, validateRequest(sendMessageSchema), ChatController.sendMessage);
router.get('/rooms/:roomId/messages', apiLimiter, ChatController.getMessages);
router.delete('/messages/:messageId', apiLimiter, ChatController.deleteMessage);

// Private rooms
router.post('/rooms/private', apiLimiter, ChatController.createPrivateRoom);

// User search
router.get('/users/search', apiLimiter, ChatController.searchUsers);

export default router;