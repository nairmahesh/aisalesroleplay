import { useState, useEffect } from 'react';
import { Plus, Users, Clock, Search } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface PracticeRoom {
  id: string;
  name: string;
  created_by: string;
  status: 'waiting' | 'active' | 'completed';
  created_at: string;
  participants_count: number;
}

export function HumanToHumanView() {
  const [rooms, setRooms] = useState<PracticeRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchRooms();
  }, []);

  async function fetchRooms() {
    try {
      const { data, error } = await supabase
        .from('practice_rooms')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRooms(data || []);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    } finally {
      setLoading(false);
    }
  }

  async function createRoom() {
    if (!newRoomName.trim()) return;

    try {
      const { error } = await supabase
        .from('practice_rooms')
        .insert([
          {
            name: newRoomName,
            status: 'waiting',
            participants_count: 0,
          },
        ]);

      if (error) throw error;

      setNewRoomName('');
      setShowCreateModal(false);
      fetchRooms();
    } catch (error) {
      console.error('Error creating room:', error);
    }
  }

  const filteredRooms = rooms.filter((room) =>
    room.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-slate-600">Loading practice rooms...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Human to Human Practice</h1>
          <p className="text-slate-600">
            Practice with a colleague or manager. Create or join a practice room.
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          Create Room
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search rooms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRooms.map((room) => (
          <div
            key={room.id}
            className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">{room.name}</h3>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Clock className="w-4 h-4" />
                  {new Date(room.created_at).toLocaleDateString()}
                </div>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  room.status === 'waiting'
                    ? 'bg-yellow-100 text-yellow-700'
                    : room.status === 'active'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                {room.status}
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm text-slate-600 mb-4">
              <Users className="w-4 h-4" />
              {room.participants_count} participant{room.participants_count !== 1 ? 's' : ''}
            </div>

            <button className="w-full px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white font-medium rounded-lg transition-colors">
              Join Room
            </button>
          </div>
        ))}
      </div>

      {filteredRooms.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-500">No practice rooms found. Create one to get started!</p>
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Create Practice Room</h3>
            <input
              type="text"
              placeholder="Room name (e.g., Discovery Call Practice)"
              value={newRoomName}
              onChange={(e) => setNewRoomName(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none mb-4"
              autoFocus
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2.5 text-slate-600 hover:text-slate-900 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={createRoom}
                disabled={!newRoomName.trim()}
                className="flex-1 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
