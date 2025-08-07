import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { validateRequest, loginSchema, registerSchema } from '../middlewares/validation';
import { authenticateToken } from '../middlewares/auth';
import { authLimiter } from '../middlewares/rateLimiter';

const router = Router();

// Public routes with rate limiting
router.post('/register', authLimiter, validateRequest(registerSchema), AuthController.register);
router.post('/login', authLimiter, validateRequest(loginSchema), AuthController.login);
router.post('/refresh', authLimiter, AuthController.refreshToken);
router.post('/logout', AuthController.logout);

// Protected routes
router.post('/logout-all', authenticateToken, AuthController.logoutAll);
router.get('/profile', authenticateToken, AuthController.getProfile);

export default router;