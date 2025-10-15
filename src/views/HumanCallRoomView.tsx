import { useState, useEffect, useRef } from 'react';
import { Phone, PhoneOff, Mic, MicOff, Video, VideoOff, ArrowLeft, Copy, Users } from 'lucide-react';
import { WebRTCConnection } from '../lib/webrtc';
import { supabase } from '../lib/supabase';

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

interface HumanCallRoomViewProps {
  roomId: string;
  onLeave: () => void;
}

export function HumanCallRoomView({ roomId, onLeave }: HumanCallRoomViewProps) {
  const [room, setRoom] = useState<PracticeRoom | null>(null);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [connectionState, setConnectionState] = useState<string>('new');
  const [participantCount, setParticipantCount] = useState(0);
  const [copied, setCopied] = useState(false);

  const webrtcRef = useRef<WebRTCConnection | null>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const userIdRef = useRef<string>(`user-${Date.now()}`);

  useEffect(() => {
    fetchRoomDetails();
    setupPresence();

    return () => {
      if (webrtcRef.current) {
        webrtcRef.current.cleanup();
      }
    };
  }, [roomId]);

  async function fetchRoomDetails() {
    const { data, error } = await supabase
      .from('practice_rooms')
      .select('*')
      .eq('id', roomId)
      .single();

    if (error) {
      console.error('Error fetching room:', error);
      return;
    }

    setRoom(data);
  }

  async function setupPresence() {
    const channel = supabase.channel(`presence:room:${roomId}`, {
      config: {
        presence: {
          key: userIdRef.current,
        },
      },
    });

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        setParticipantCount(Object.keys(state).length);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            online_at: new Date().toISOString(),
          });
        }
      });
  }

  async function startCall() {
    if (!room) return;

    try {
      const webrtc = new WebRTCConnection(room.room_code, userIdRef.current);
      webrtcRef.current = webrtc;

      await webrtc.initialize();
      const localStream = await webrtc.startLocalStream();

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = localStream;
      }

      webrtc.onRemoteStream((stream) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = stream;
        }
      });

      webrtc.onConnectionStateChange((state) => {
        setConnectionState(state);
      });

      await webrtc.createOffer();
      setIsCallActive(true);

      await supabase
        .from('practice_rooms')
        .update({ status: 'active' })
        .eq('id', roomId);
    } catch (error) {
      console.error('Error starting call:', error);
      alert('Failed to start call. Please check your camera and microphone permissions.');
    }
  }

  async function endCall() {
    if (webrtcRef.current) {
      await webrtcRef.current.cleanup();
      webrtcRef.current = null;
    }

    setIsCallActive(false);

    await supabase
      .from('practice_rooms')
      .update({ status: 'completed' })
      .eq('id', roomId);

    onLeave();
  }

  function toggleMute() {
    if (webrtcRef.current) {
      webrtcRef.current.toggleAudio(!isMuted);
      setIsMuted(!isMuted);
    }
  }

  function toggleVideo() {
    if (webrtcRef.current) {
      webrtcRef.current.toggleVideo(isVideoOff);
      setIsVideoOff(!isVideoOff);
    }
  }

  function copyRoomCode() {
    if (room?.room_code) {
      navigator.clipboard.writeText(room.room_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  if (!room) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-slate-600">Loading room...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      <div className="bg-slate-800 border-b border-slate-700 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={onLeave}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Leave Room</span>
          </button>
          <div className="text-center">
            <h2 className="text-xl font-bold text-white">{room.name}</h2>
            <div className="flex items-center justify-center gap-2 mt-1">
              <span className="text-sm text-slate-400">Room Code:</span>
              <button
                onClick={copyRoomCode}
                className="flex items-center gap-1 px-2 py-1 bg-slate-700 hover:bg-slate-600 text-cyan-400 text-sm font-mono rounded transition-colors"
              >
                {room.room_code}
                <Copy className="w-3 h-3" />
              </button>
              {copied && <span className="text-xs text-green-400">Copied!</span>}
            </div>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <Users className="w-5 h-5" />
            <span>{participantCount} online</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="max-w-7xl mx-auto h-full flex gap-6 p-6">
          <div className="flex-1 flex flex-col gap-4">
            <div className="flex-1 bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden relative">
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              {connectionState !== 'connected' && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-900 bg-opacity-80">
                  <div className="text-center">
                    <div className="w-24 h-24 rounded-full bg-slate-700 flex items-center justify-center mx-auto mb-4">
                      <Users className="w-12 h-12 text-slate-400" />
                    </div>
                    <p className="text-white font-medium">Waiting for partner...</p>
                    <p className="text-sm text-slate-400 mt-2">Share the room code to invite them</p>
                  </div>
                </div>
              )}
            </div>

            <div className="h-48 bg-slate-800 rounded-xl border border-slate-700 overflow-hidden relative">
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-3 left-3 bg-slate-900 bg-opacity-80 px-3 py-1 rounded-full text-white text-sm">
                You
              </div>
            </div>
          </div>

          <div className="w-96 bg-slate-800 rounded-2xl border border-slate-700 p-6 overflow-y-auto">
            <h3 className="text-lg font-bold text-white mb-4">Scenario Details</h3>

            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-cyan-400 mb-2">Sales Rep</h4>
                <p className="text-white">{room.rep_name}</p>
              </div>

              <div className="border-t border-slate-700 pt-4">
                <h4 className="text-sm font-semibold text-cyan-400 mb-2">Client</h4>
                <p className="text-white font-medium">{room.client_name}</p>
                <p className="text-slate-400 text-sm">{room.client_designation}</p>
                <p className="text-slate-400 text-sm">{room.client_company}</p>
              </div>

              <div className="border-t border-slate-700 pt-4">
                <h4 className="text-sm font-semibold text-cyan-400 mb-2">About Company</h4>
                <p className="text-slate-300 text-sm leading-relaxed">{room.company_description}</p>
              </div>

              <div className="border-t border-slate-700 pt-4">
                <h4 className="text-sm font-semibold text-cyan-400 mb-2">Call Objective</h4>
                <p className="text-slate-300 text-sm leading-relaxed">{room.call_objective}</p>
              </div>

              <div className="border-t border-slate-700 pt-4">
                <h4 className="text-sm font-semibold text-cyan-400 mb-2">Call to Action</h4>
                <p className="text-slate-300 text-sm leading-relaxed">{room.call_cta}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-800 border-t border-slate-700 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-center">
          {!isCallActive ? (
            <button
              onClick={startCall}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
              <div className="relative flex items-center gap-3 px-8 py-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full shadow-2xl group-hover:scale-105 transition-transform">
                <Phone className="w-6 h-6 text-white" />
                <span className="text-white font-semibold text-lg">Start Call</span>
              </div>
            </button>
          ) : (
            <div className="flex items-center gap-4">
              <button
                onClick={toggleMute}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                  isMuted
                    ? 'bg-red-500 hover:bg-red-600'
                    : 'bg-slate-600 hover:bg-slate-500'
                }`}
              >
                {isMuted ? <MicOff className="w-6 h-6 text-white" /> : <Mic className="w-6 h-6 text-white" />}
              </button>

              <button
                onClick={toggleVideo}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                  isVideoOff
                    ? 'bg-red-500 hover:bg-red-600'
                    : 'bg-slate-600 hover:bg-slate-500'
                }`}
              >
                {isVideoOff ? <VideoOff className="w-6 h-6 text-white" /> : <Video className="w-6 h-6 text-white" />}
              </button>

              <button
                onClick={endCall}
                className="group relative ml-4"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-rose-500 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
                <div className="relative w-16 h-16 bg-gradient-to-br from-red-500 to-rose-600 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                  <PhoneOff className="w-8 h-8 text-white" />
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
