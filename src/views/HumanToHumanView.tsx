import { useState, useEffect } from 'react';
import { Plus, Clock, Search, Info, Share2, Edit2, Trash2, MoreVertical } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { CreateRoomModal, RoomFormData } from '../components/CreateRoomModal';
import { ShareInviteModal } from '../components/ShareInviteModal';
import { HumanCallRoomView } from './HumanCallRoomView';

interface PracticeRoom {
  id: string;
  name: string;
  room_code: string;
  created_by: string;
  status: 'waiting' | 'active' | 'completed';
  created_at: string;
  participants_count: number;
  rep_name: string;
  client_name: string;
  client_company: string;
  allow_external: boolean;
  external_invite_token: string | null;
}

export function HumanToHumanView() {
  const [rooms, setRooms] = useState<PracticeRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
  const [shareRoom, setShareRoom] = useState<{ token: string; name: string } | null>(null);
  const [editingRoom, setEditingRoom] = useState<PracticeRoom | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  useEffect(() => {
    fetchRooms();
    checkForRoomInUrl();

    const channel = supabase
      .channel('practice_rooms_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'practice_rooms' }, () => {
        fetchRooms();
      })
      .subscribe();

    const handleClickOutside = () => setOpenMenuId(null);
    document.addEventListener('click', handleClickOutside);

    return () => {
      supabase.removeChannel(channel);
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  async function checkForRoomInUrl() {
    const params = new URLSearchParams(window.location.search);
    const roomCode = params.get('room');

    if (roomCode) {
      const { data } = await supabase
        .from('practice_rooms')
        .select('id')
        .eq('room_code', roomCode)
        .maybeSingle();

      if (data?.id) {
        setActiveRoomId(data.id);
      }
    }
  }

  async function fetchRooms() {
    try {
      const { data, error } = await supabase
        .from('practice_rooms')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      console.log('Fetched rooms:', data);
      setRooms(data || []);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    } finally {
      setLoading(false);
    }
  }

  async function createRoom(formData: RoomFormData) {
    try {
      const roomCode = await generateRoomCode();
      let externalToken = null;

      if (formData.allow_external) {
        externalToken = generateFallbackToken();
        console.log('External invite enabled, token:', externalToken);
      }

      console.log('Creating room with external:', formData.allow_external, 'token:', externalToken);

      const { error } = await supabase
        .from('practice_rooms')
        .insert([
          {
            name: formData.name,
            room_code: roomCode,
            created_by: null,
            rep_name: formData.rep_name,
            client_name: formData.client_name,
            client_company: formData.client_company,
            client_designation: formData.client_designation,
            company_description: formData.company_description,
            call_objective: formData.call_objective,
            call_cta: formData.call_cta,
            status: 'waiting',
            participants_count: 0,
            allow_external: formData.allow_external,
            external_invite_token: externalToken,
          },
        ]);

      if (error) {
        console.error('Supabase error:', error);
        alert(`Failed to create room: ${error.message || JSON.stringify(error)}`);
        throw error;
      }

      setShowCreateModal(false);
      await fetchRooms();
    } catch (error: any) {
      console.error('Error creating room:', error);
      alert(`Failed to create room: ${error?.message || error}`);
    }
  }

  async function updateRoom(formData: RoomFormData) {
    if (!editingRoom) return;

    try {
      const { error } = await supabase
        .from('practice_rooms')
        .update({
          name: formData.name,
          rep_name: formData.rep_name,
          client_name: formData.client_name,
          client_company: formData.client_company,
          client_designation: formData.client_designation,
          company_description: formData.company_description,
          call_objective: formData.call_objective,
          call_cta: formData.call_cta,
        })
        .eq('id', editingRoom.id);

      if (error) {
        console.error('Supabase error:', error);
        alert(`Failed to update room: ${error.message}`);
        throw error;
      }

      setEditingRoom(null);
      await fetchRooms();
    } catch (error: any) {
      console.error('Error updating room:', error);
      alert(`Failed to update room: ${error?.message || error}`);
    }
  }

  async function deleteRoom(roomId: string, roomName: string) {
    if (!confirm(`Are you sure you want to delete "${roomName}"? This cannot be undone.`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('practice_rooms')
        .delete()
        .eq('id', roomId);

      if (error) {
        console.error('Supabase error:', error);
        alert(`Failed to delete room: ${error.message}`);
        throw error;
      }

      setOpenMenuId(null);
      await fetchRooms();
    } catch (error: any) {
      console.error('Error deleting room:', error);
      alert(`Failed to delete room: ${error?.message || error}`);
    }
  }

  function generateFallbackToken(): string {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let token = '';
    for (let i = 0; i < 32; i++) {
      token += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return token;
  }

  async function generateRoomCode(): Promise<string> {
    try {
      const { data, error } = await supabase.rpc('generate_room_code');
      if (error || !data) {
        console.log('RPC generate_room_code not available, using fallback');
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        let code = '';
        for (let i = 0; i < 6; i++) {
          code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
      }
      return data;
    } catch (err) {
      console.log('Error calling generate_room_code RPC, using fallback:', err);
      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
      let code = '';
      for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return code;
    }
  }

  function handleJoinRoom(roomId: string) {
    setActiveRoomId(roomId);
  }

  function handleLeaveRoom() {
    setActiveRoomId(null);
    fetchRooms();
  }

  function openShareModal(token: string, roomName: string) {
    setShareRoom({ token, name: roomName });
  }

  const filteredRooms = rooms.filter((room) =>
    room.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (activeRoomId) {
    return <HumanCallRoomView roomId={activeRoomId} onLeave={handleLeaveRoom} />;
  }

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
            Practice with a colleague or manager using live video calls. Create structured roleplay scenarios.
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

      <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4">
        <div className="flex gap-3">
          <Info className="w-5 h-5 text-cyan-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-cyan-900">
            <p className="font-medium mb-1">WebRTC-based Video Calls</p>
            <p className="text-cyan-800">
              Rooms use peer-to-peer video connections. Share the room code with your partner to join the same session.
            </p>
          </div>
        </div>
      </div>

      {rooms.length > 0 && rooms[0] && (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
          <p className="text-xs font-mono text-slate-600">
            Debug - First room: allow_external={String(rooms[0].allow_external)},
            token={rooms[0].external_invite_token ? 'exists' : 'null'}
          </p>
        </div>
      )}

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

      {filteredRooms.length === 0 && (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-8 text-center">
          <p className="text-slate-600">No practice rooms yet. Create one to get started!</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRooms.map((room) => (
          <div
            key={room.id}
            className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-shadow relative"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1 pr-2">
                <h3 className="text-lg font-bold text-slate-900 mb-1">{room.name}</h3>
                <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                  <Clock className="w-4 h-4" />
                  {new Date(room.created_at).toLocaleDateString()}
                </div>
                {room.room_code && (
                  <div className="text-xs text-slate-600 font-mono bg-slate-100 px-2 py-1 rounded inline-block">
                    Code: {room.room_code}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                    room.status === 'waiting'
                      ? 'bg-yellow-100 text-yellow-700'
                      : room.status === 'active'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {room.status}
                </span>
                {room.status === 'waiting' && (
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuId(openMenuId === room.id ? null : room.id);
                      }}
                      className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      <MoreVertical className="w-4 h-4 text-slate-600" />
                    </button>
                    {openMenuId === room.id && (
                      <div className="absolute right-0 top-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-10 min-w-[140px]">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingRoom(room);
                            setOpenMenuId(null);
                          }}
                          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors rounded-t-lg"
                        >
                          <Edit2 className="w-4 h-4" />
                          Edit
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteRoom(room.id, room.name);
                          }}
                          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors rounded-b-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {room.rep_name && room.client_name && (
              <div className="mb-4 text-sm">
                <div className="flex items-center gap-2 text-slate-600">
                  <span className="font-medium">Rep:</span>
                  <span>{room.rep_name}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <span className="font-medium">Client:</span>
                  <span>{room.client_name} ({room.client_company})</span>
                </div>
              </div>
            )}

            {room.allow_external && room.external_invite_token ? (
              <div className="mb-3">
                <button
                  onClick={() => openShareModal(room.external_invite_token!, room.name)}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-cyan-50 to-blue-50 hover:from-cyan-100 hover:to-blue-100 border border-cyan-200 text-cyan-700 text-sm font-semibold rounded-lg transition-all"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share External Invite</span>
                </button>
              </div>
            ) : room.allow_external ? (
              <div className="mb-3 p-2 bg-yellow-50 border border-yellow-200 rounded-lg text-xs text-yellow-700">
                External access enabled - invite link generating...
              </div>
            ) : null}

            <button
              onClick={() => handleJoinRoom(room.id)}
              className="w-full px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white font-medium rounded-lg transition-colors"
            >
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
        <CreateRoomModal
          onClose={() => setShowCreateModal(false)}
          onCreateRoom={createRoom}
        />
      )}

      {editingRoom && (
        <CreateRoomModal
          onClose={() => setEditingRoom(null)}
          onCreateRoom={updateRoom}
          initialData={{
            name: editingRoom.name,
            rep_name: editingRoom.rep_name,
            client_name: editingRoom.client_name,
            client_company: editingRoom.client_company,
            client_designation: '',
            company_description: '',
            call_objective: '',
            call_cta: '',
            allow_external: editingRoom.allow_external,
          }}
          isEditing={true}
        />
      )}

      {shareRoom && (
        <ShareInviteModal
          inviteToken={shareRoom.token}
          roomName={shareRoom.name}
          onClose={() => setShareRoom(null)}
        />
      )}
    </div>
  );
}
