import { useState, useEffect } from 'react';
import { practiceRoomService } from '../services/PracticeRoomService';
import { PracticeRoom, CreateRoomData, UpdateRoomData, RoomFilters } from '../types';
import { supabase } from '../../../lib/supabase';

export function usePracticeRooms(filters?: RoomFilters) {
  const [rooms, setRooms] = useState<PracticeRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRooms();

    const channel = supabase
      .channel('practice_rooms_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'practice_rooms' }, () => {
        fetchRooms();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [filters]);

  async function fetchRooms() {
    setLoading(true);
    const response = await practiceRoomService.getRooms(filters);

    if (response.success && response.data) {
      setRooms(response.data);
      setError(null);
    } else {
      setError(response.error?.message || 'Failed to fetch rooms');
    }

    setLoading(false);
  }

  async function createRoom(roomData: CreateRoomData): Promise<boolean> {
    const response = await practiceRoomService.createRoom(roomData);

    if (response.success) {
      await fetchRooms();
      return true;
    } else {
      setError(response.error?.message || 'Failed to create room');
      return false;
    }
  }

  async function updateRoom(id: string, roomData: UpdateRoomData): Promise<boolean> {
    const response = await practiceRoomService.updateRoom(id, roomData);

    if (response.success) {
      await fetchRooms();
      return true;
    } else {
      setError(response.error?.message || 'Failed to update room');
      return false;
    }
  }

  async function deleteRoom(id: string): Promise<boolean> {
    const response = await practiceRoomService.deleteRoom(id);

    if (response.success) {
      await fetchRooms();
      return true;
    } else {
      setError(response.error?.message || 'Failed to delete room');
      return false;
    }
  }

  return {
    rooms,
    loading,
    error,
    createRoom,
    updateRoom,
    deleteRoom,
    refresh: fetchRooms,
  };
}
