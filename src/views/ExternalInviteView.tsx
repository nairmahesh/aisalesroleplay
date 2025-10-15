import { useState, useEffect } from 'react';
import { Video, Users, Briefcase } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { HumanCallRoomView } from './HumanCallRoomView';

interface PracticeRoom {
  id: string;
  name: string;
  room_code: string;
  rep_name: string;
  client_name: string;
  client_company: string;
  client_designation: string;
  company_description: string;
  call_objective: string;
  call_cta: string;
  status: string;
}

export function ExternalInviteView() {
  const [room, setRoom] = useState<PracticeRoom | null>(null);
  const [participantName, setParticipantName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [hasJoined, setHasJoined] = useState(false);

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get('token');
    if (token) {
      fetchRoomByToken(token);
    } else {
      setError('Invalid invite link');
      setLoading(false);
    }
  }, []);

  async function fetchRoomByToken(token: string) {
    try {
      const { data, error } = await supabase
        .from('practice_rooms')
        .select('*')
        .eq('external_invite_token', token)
        .maybeSingle();

      if (error || !data) {
        setError('Room not found or invite link expired');
        setLoading(false);
        return;
      }

      if (data.status === 'completed') {
        setError('This practice session has already been completed');
        setLoading(false);
        return;
      }

      setRoom(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load room details');
      setLoading(false);
    }
  }

  async function handleJoinRoom() {
    if (!participantName.trim() || !room) return;

    await supabase
      .from('practice_rooms')
      .update({ external_participant_name: participantName })
      .eq('id', room.id);

    setHasJoined(true);
  }

  function handleLeaveRoom() {
    setHasJoined(false);
    window.location.href = '/';
  }

  if (hasJoined && room) {
    return <HumanCallRoomView roomId={room.id} onLeave={handleLeaveRoom} />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Video className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Unable to Join</h2>
          <p className="text-slate-600 mb-6">{error}</p>
          <a
            href="/"
            className="inline-block px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg transition-colors"
          >
            Go to Homepage
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl p-8 max-w-2xl w-full">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Video className="w-8 h-8 text-cyan-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Practice Room Invite</h1>
          <p className="text-slate-600">You've been invited to join a sales practice session</p>
        </div>

        <div className="bg-slate-50 rounded-xl p-6 mb-6 space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">
              Practice Session
            </h3>
            <p className="text-lg font-bold text-slate-900">{room.name}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200">
            <div>
              <div className="flex items-center gap-2 text-sm text-slate-600 mb-1">
                <Users className="w-4 h-4" />
                <span className="font-medium">Sales Rep</span>
              </div>
              <p className="text-slate-900 ml-6">{room.rep_name}</p>
            </div>

            <div>
              <div className="flex items-center gap-2 text-sm text-slate-600 mb-1">
                <Users className="w-4 h-4" />
                <span className="font-medium">Client</span>
              </div>
              <p className="text-slate-900 ml-6">{room.client_name}</p>
              <p className="text-sm text-slate-600 ml-6">{room.client_designation}</p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200">
            <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
              <Briefcase className="w-4 h-4" />
              <span className="font-medium">Company</span>
            </div>
            <p className="text-slate-900 ml-6 mb-2">{room.client_company}</p>
            <p className="text-sm text-slate-600 ml-6">{room.company_description}</p>
          </div>

          <div className="pt-4 border-t border-slate-200">
            <h4 className="text-sm font-semibold text-slate-600 mb-2">Call Objective</h4>
            <p className="text-sm text-slate-700">{room.call_objective}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Your Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={participantName}
              onChange={(e) => setParticipantName(e.target.value)}
              placeholder="Enter your full name"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
              onKeyPress={(e) => e.key === 'Enter' && handleJoinRoom()}
            />
          </div>

          <button
            onClick={handleJoinRoom}
            disabled={!participantName.trim()}
            className="w-full px-6 py-4 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            Join Practice Room
          </button>

          <p className="text-xs text-center text-slate-500">
            By joining, you agree to participate in this practice session via video call
          </p>
        </div>
      </div>
    </div>
  );
}
