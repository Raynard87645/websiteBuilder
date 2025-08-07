import { query } from '../config/database';
import { User, UserResponse } from '../types';

export class UserModel {
  static async create(username: string, email: string, hashedPassword: string): Promise<UserResponse> {
    const result = await query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email, created_at',
      [username, email, hashedPassword]
    );
    return result.rows[0];
  }

  static async findByEmail(email: string): Promise<User | null> {
    const result = await query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0] || null;
  }

  static async findById(id: number): Promise<UserResponse | null> {
    const result = await query(
      'SELECT id, username, email, created_at FROM users WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  }

  static async findByUsername(username: string): Promise<UserResponse | null> {
    const result = await query(
      'SELECT id, username, email, created_at FROM users WHERE username = $1',
      [username]
    );
    return result.rows[0] || null;
  }

  static async updateLastSeen(id: number): Promise<void> {
    await query('UPDATE users SET updated_at = NOW() WHERE id = $1', [id]);
  }

  static async getAllUsers(): Promise<UserResponse[]> {
    const result = await query(
      'SELECT id, username, email, created_at FROM users ORDER BY username'
    );
    return result.rows;
  }
}