import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/User';
import { query } from '../config/database';
import { AuthTokens, JWTPayload, UserResponse } from '../types';

export class AuthService {
  private static readonly SALT_ROUNDS = 12;
  private static readonly JWT_SECRET = process.env.JWT_SECRET!;
  private static readonly JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;
  private static readonly JWT_EXPIRE = process.env.JWT_EXPIRE || '15m';
  private static readonly JWT_REFRESH_EXPIRE = process.env.JWT_REFRESH_EXPIRE || '7d';

  static async register(username: string, email: string, password: string): Promise<{ user: UserResponse; tokens: AuthTokens }> {
    // Check if user already exists
    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const existingUsername = await UserModel.findByUsername(username);
    if (existingUsername) {
      throw new Error('Username already taken');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, this.SALT_ROUNDS);

    // Create user
    const user = await UserModel.create(username, email, hashedPassword);

    // Generate tokens
    const tokens = this.generateTokens(user);

    // Store refresh token
    await this.storeRefreshToken(user.id, tokens.refreshToken);

    return { user, tokens };
  }

  static async login(email: string, password: string): Promise<{ user: UserResponse; tokens: AuthTokens }> {
    // Find user
    const user = await UserModel.findByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    // Generate tokens
    const userResponse: UserResponse = {
      id: user.id,
      username: user.username,
      email: user.email,
      created_at: user.created_at
    };

    const tokens = this.generateTokens(userResponse);

    // Store refresh token
    await this.storeRefreshToken(user.id, tokens.refreshToken);

    // Update last seen
    await UserModel.updateLastSeen(user.id);

    return { user: userResponse, tokens };
  }

  static async refreshToken(refreshToken: string): Promise<AuthTokens> {
    try {
      // Verify refresh token
      const decoded = jwt.verify(refreshToken, this.JWT_REFRESH_SECRET) as JWTPayload;

      // Check if refresh token exists in database
      const tokenResult = await query(
        'SELECT * FROM refresh_tokens WHERE token = $1 AND user_id = $2 AND expires_at > NOW()',
        [refreshToken, decoded.userId]
      );

      if (tokenResult.rows.length === 0) {
        throw new Error('Invalid refresh token');
      }

      // Get user data
      const user = await UserModel.findById(decoded.userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Generate new tokens
      const tokens = this.generateTokens(user);

      // Replace old refresh token with new one
      await this.replaceRefreshToken(refreshToken, tokens.refreshToken, decoded.userId);

      return tokens;
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  static async logout(refreshToken: string): Promise<void> {
    await query('DELETE FROM refresh_tokens WHERE token = $1', [refreshToken]);
  }

  static async logoutAll(userId: number): Promise<void> {
    await query('DELETE FROM refresh_tokens WHERE user_id = $1', [userId]);
  }

  private static generateTokens(user: UserResponse): AuthTokens {
    const payload: JWTPayload = {
      userId: user.id,
      username: user.username,
      email: user.email
    };

    const accessToken = jwt.sign(payload, this.JWT_SECRET, {
      expiresIn: this.JWT_EXPIRE
    });

    const refreshToken = jwt.sign(payload, this.JWT_REFRESH_SECRET, {
      expiresIn: this.JWT_REFRESH_EXPIRE
    });

    return { accessToken, refreshToken };
  }

  private static async storeRefreshToken(userId: number, token: string): Promise<void> {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

    await query(
      'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
      [userId, token, expiresAt]
    );
  }

  private static async replaceRefreshToken(oldToken: string, newToken: string, userId: number): Promise<void> {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await query('BEGIN');
    try {
      await query('DELETE FROM refresh_tokens WHERE token = $1', [oldToken]);
      await query(
        'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
        [userId, newToken, expiresAt]
      );
      await query('COMMIT');
    } catch (error) {
      await query('ROLLBACK');
      throw error;
    }
  }

  static async cleanupExpiredTokens(): Promise<void> {
    await query('DELETE FROM refresh_tokens WHERE expires_at < NOW()');
  }
}