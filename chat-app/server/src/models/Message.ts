import { query } from '../config/database';
import { Message, MessageResponse } from '../types';

export class MessageModel {
  static async create(roomId: number, userId: number, content: string): Promise<MessageResponse> {
    const result = await query(`
      INSERT INTO messages (room_id, user_id, content) 
      VALUES ($1, $2, $3) 
      RETURNING m.*, u.username
      FROM messages m
      JOIN users u ON m.user_id = u.id
      WHERE m.id = (SELECT id FROM messages ORDER BY id DESC LIMIT 1)
    `, [roomId, userId, content]);
    
    // If the above doesn't work, let's do it in two steps
    const messageResult = await query(
      'INSERT INTO messages (room_id, user_id, content) VALUES ($1, $2, $3) RETURNING *',
      [roomId, userId, content]
    );
    
    const userResult = await query(
      'SELECT username FROM users WHERE id = $1',
      [userId]
    );
    
    return {
      ...messageResult.rows[0],
      username: userResult.rows[0].username
    };
  }

  static async findByRoom(roomId: number, limit: number = 50, offset: number = 0): Promise<MessageResponse[]> {
    const result = await query(`
      SELECT m.*, u.username 
      FROM messages m
      JOIN users u ON m.user_id = u.id
      WHERE m.room_id = $1
      ORDER BY m.created_at DESC
      LIMIT $2 OFFSET $3
    `, [roomId, limit, offset]);
    return result.rows.reverse(); // Reverse to get chronological order
  }

  static async findById(id: number): Promise<MessageResponse | null> {
    const result = await query(`
      SELECT m.*, u.username 
      FROM messages m
      JOIN users u ON m.user_id = u.id
      WHERE m.id = $1
    `, [id]);
    return result.rows[0] || null;
  }

  static async deleteMessage(id: number, userId: number): Promise<boolean> {
    const result = await query(
      'DELETE FROM messages WHERE id = $1 AND user_id = $2',
      [id, userId]
    );
    return result.rowCount > 0;
  }

  static async getMessageCount(roomId: number): Promise<number> {
    const result = await query(
      'SELECT COUNT(*) as count FROM messages WHERE room_id = $1',
      [roomId]
    );
    return parseInt(result.rows[0].count);
  }
}