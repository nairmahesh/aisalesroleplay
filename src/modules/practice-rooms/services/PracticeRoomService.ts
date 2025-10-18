import { BaseService } from '../../../core/services/BaseService';
import { ApiResponse } from '../../../core/types';
import { supabase } from '../../../lib/supabase';
import { PracticeRoom, CreateRoomData, UpdateRoomData, RoomFilters } from '../types';

export class PracticeRoomService extends BaseService {
  private static instance: PracticeRoomService;

  private constructor() {
    super();
  }

  static getInstance(): PracticeRoomService {
    if (!PracticeRoomService.instance) {
      PracticeRoomService.instance = new PracticeRoomService();
    }
    return PracticeRoomService.instance;
  }

  async getRooms(filters?: RoomFilters): Promise<ApiResponse<PracticeRoom[]>> {
    try {
      let query = supabase
        .from('practice_rooms')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      if (filters?.created_by) {
        query = query.eq('created_by', filters.created_by);
      }

      const { data, error } = await query;

      if (error) throw error;

      let rooms = data || [];

      if (filters?.search) {
        const searchLower = filters.search.toLowerCase();
        rooms = rooms.filter((room) =>
          room.name.toLowerCase().includes(searchLower)
        );
      }

      return this.success(rooms);
    } catch (error) {
      return this.error(this.handleError(error));
    }
  }

  async getRoomById(id: string): Promise<ApiResponse<PracticeRoom>> {
    try {
      const { data, error } = await supabase
        .from('practice_rooms')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      return this.success(data);
    } catch (error) {
      return this.error(this.handleError(error));
    }
  }

  async getRoomByCode(code: string): Promise<ApiResponse<PracticeRoom>> {
    try {
      const { data, error } = await supabase
        .from('practice_rooms')
        .select('*')
        .eq('room_code', code)
        .maybeSingle();

      if (error) throw error;
      if (!data) {
        return this.error({
          code: 'NOT_FOUND',
          message: 'Room not found',
        });
      }

      return this.success(data);
    } catch (error) {
      return this.error(this.handleError(error));
    }
  }

  async createRoom(roomData: CreateRoomData): Promise<ApiResponse<PracticeRoom>> {
    try {
      const roomCode = await this.generateRoomCode();
      let externalToken = null;

      if (roomData.allow_external) {
        externalToken = this.generateToken();
      }

      const { data, error } = await supabase
        .from('practice_rooms')
        .insert([
          {
            ...roomData,
            room_code: roomCode,
            created_by: null,
            status: 'waiting',
            participants_count: 0,
            external_invite_token: externalToken,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      return this.success(data);
    } catch (error) {
      return this.error(this.handleError(error));
    }
  }

  async updateRoom(id: string, roomData: UpdateRoomData): Promise<ApiResponse<PracticeRoom>> {
    try {
      const { data, error } = await supabase
        .from('practice_rooms')
        .update(roomData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return this.success(data);
    } catch (error) {
      return this.error(this.handleError(error));
    }
  }

  async deleteRoom(id: string): Promise<ApiResponse<void>> {
    try {
      const { error } = await supabase
        .from('practice_rooms')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return this.success(undefined);
    } catch (error) {
      return this.error(this.handleError(error));
    }
  }

  async updateRoomStatus(
    id: string,
    status: 'waiting' | 'active' | 'completed'
  ): Promise<ApiResponse<void>> {
    try {
      const { error } = await supabase
        .from('practice_rooms')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      return this.success(undefined);
    } catch (error) {
      return this.error(this.handleError(error));
    }
  }

  private async generateRoomCode(): Promise<string> {
    try {
      const { data, error } = await supabase.rpc('generate_room_code');
      if (error || !data) {
        return this.generateFallbackCode();
      }
      return data;
    } catch {
      return this.generateFallbackCode();
    }
  }

  private generateFallbackCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  private generateToken(): string {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let token = '';
    for (let i = 0; i < 32; i++) {
      token += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return token;
  }
}

export const practiceRoomService = PracticeRoomService.getInstance();
