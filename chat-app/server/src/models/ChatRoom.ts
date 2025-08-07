import { query } from '../config/database';
import { ChatRoom } from '../types';

export class ChatRoomModel {
  static async create(name: string, type: 'private' | 'group', createdBy: number): Promise<ChatRoom> {
    const result = await query(
      'INSERT INTO chat_rooms (name, type, created_by) VALUES ($1, $2, $3) RETURNING *',
      [name, type, createdBy]
    );
    return result.rows[0];
  }

  static async findById(id: number): Promise<ChatRoom | null> {
    const result = await query('SELECT * FROM chat_rooms WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  static async findByUser(userId: number): Promise<ChatRoom[]> {
    const result = await query(`
      SELECT DISTINCT cr.* 
      FROM chat_rooms cr
      JOIN room_participants rp ON cr.id = rp.room_id
      WHERE rp.user_id = $1
      ORDER BY cr.updated_at DESC
    `, [userId]);
    return result.rows;
  }

  static async addParticipant(roomId: number, userId: number): Promise<void> {
    await query(
      'INSERT INTO room_participants (room_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [roomId, userId]
    );
  }

  static async removeParticipant(roomId: number, userId: number): Promise<void> {
    await query(
      'DELETE FROM room_participants WHERE room_id = $1 AND user_id = $2',
      [roomId, userId]
    );
  }

  static async getParticipants(roomId: number): Promise<number[]> {
    const result = await query(
      'SELECT user_id FROM room_participants WHERE room_id = $1',
      [roomId]
    );
    return result.rows.map(row => row.user_id);
  }

  static async updateActivity(roomId: number): Promise<void> {
    await query('UPDATE chat_rooms SET updated_at = NOW() WHERE id = $1', [roomId]);
  }

  static async findPrivateRoom(user1Id: number, user2Id: number): Promise<ChatRoom | null> {
    const result = await query(`
      SELECT cr.* FROM chat_rooms cr
      WHERE cr.type = 'private'
      AND cr.id IN (
        SELECT room_id FROM room_participants WHERE user_id = $1
        INTERSECT
        SELECT room_id FROM room_participants WHERE user_id = $2
      )
      AND (
        SELECT COUNT(*) FROM room_participants WHERE room_id = cr.id
      ) = 2
    `, [user1Id, user2Id]);
    return result.rows[0] || null;
  }
}