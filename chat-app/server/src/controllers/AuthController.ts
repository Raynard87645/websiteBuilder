import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';
import { ApiResponse, LoginRequest, RegisterRequest } from '../types';

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const { username, email, password }: RegisterRequest = req.body;
      
      const result = await AuthService.register(username, email, password);
      
      const response: ApiResponse = {
        success: true,
        data: result,
        message: 'User registered successfully'
      };
      
      res.status(201).json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        error: error instanceof Error ? error.message : 'Registration failed'
      };
      
      res.status(400).json(response);
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password }: LoginRequest = req.body;
      
      const result = await AuthService.login(email, password);
      
      const response: ApiResponse = {
        success: true,
        data: result,
        message: 'Login successful'
      };
      
      res.status(200).json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        error: error instanceof Error ? error.message : 'Login failed'
      };
      
      res.status(401).json(response);
    }
  }

  static async refreshToken(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;
      
      if (!refreshToken) {
        return res.status(400).json({
          success: false,
          error: 'Refresh token is required'
        });
      }
      
      const tokens = await AuthService.refreshToken(refreshToken);
      
      const response: ApiResponse = {
        success: true,
        data: tokens,
        message: 'Tokens refreshed successfully'
      };
      
      res.status(200).json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        error: error instanceof Error ? error.message : 'Token refresh failed'
      };
      
      res.status(401).json(response);
    }
  }

  static async logout(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;
      
      if (refreshToken) {
        await AuthService.logout(refreshToken);
      }
      
      const response: ApiResponse = {
        success: true,
        message: 'Logout successful'
      };
      
      res.status(200).json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        error: error instanceof Error ? error.message : 'Logout failed'
      };
      
      res.status(500).json(response);
    }
  }

  static async logoutAll(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
      }
      
      await AuthService.logoutAll(userId);
      
      const response: ApiResponse = {
        success: true,
        message: 'Logged out from all devices'
      };
      
      res.status(200).json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        error: error instanceof Error ? error.message : 'Logout failed'
      };
      
      res.status(500).json(response);
    }
  }

  static async getProfile(req: Request, res: Response) {
    try {
      const response: ApiResponse = {
        success: true,
        data: req.user,
        message: 'Profile retrieved successfully'
      };
      
      res.status(200).json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        error: 'Failed to retrieve profile'
      };
      
      res.status(500).json(response);
    }
  }
}