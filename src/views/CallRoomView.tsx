import { useState, useEffect } from 'react';
import { Phone, PhoneOff, Mic, MicOff, Volume2, VolumeX, MessageSquare, User, Bot as BotIcon, ArrowLeft } from 'lucide-react';
import { Bot, supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { PracticeMode } from '../components/PracticeModeSelector';

interface CallRoomViewProps {
  bot: Bot;
  practiceMode: PracticeMode;
  onEndCall: () => void;
}

interface Message {
  id: string;
  speaker: 'user' | 'bot';
  message: string;
  timestamp: Date;
  sentiment?: 'positive' | 'neutral' | 'negative';
}

export function CallRoomView({ bot, practiceMode, onEndCall }: CallRoomViewProps) {
  const { user } = useAuth();
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [transcript, setTranscript] = useState<Message[]>([]);
  const [callDuration, setCallDuration] = useState(0);
  const [isListening] = useState(false);
  const [callId, setCallId] = useState<string | null>(null);
  const [callStartTime, setCallStartTime] = useState<Date | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isCallActive) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCallActive]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startCall = async () => {
    if (!user) return;

    setCallStartTime(new Date());
    setIsCallActive(true);

    // Create call record in database
    const { data: newCall, error } = await supabase
      .from('calls')
      .insert({
        bot_id: bot.id,
        user_id: user.id,
        status: 'in_progress',
        started_at: new Date().toISOString(),
        practice_mode: practiceMode,
        feedback_enabled: practiceMode !== 'self_practice',
      })
      .select()
      .single();

    if (!error && newCall) {
      setCallId(newCall.id);
    }

    // Only AI bot responds automatically
    if (practiceMode === 'ai_roleplay') {
      setTimeout(() => {
        addMessage('bot', "Hello! This is " + bot.name + ". Thanks for reaching out. How can I help you today?", 'neutral');
      }, 1500);
    }
  };

  const endCall = async () => {
    setIsCallActive(false);

    // Save call data to database
    if (callId && callStartTime) {
      const endTime = new Date();
      const durationInSeconds = Math.floor((endTime.getTime() - callStartTime.getTime()) / 1000);

      // Update call record
      await supabase
        .from('calls')
        .update({
          status: 'completed',
          ended_at: endTime.toISOString(),
          duration: durationInSeconds,
        })
        .eq('id', callId);

      // Save transcript
      const transcriptData = transcript.map((msg, index) => ({
        call_id: callId,
        speaker: msg.speaker,
        message: msg.message,
        timestamp: msg.timestamp.toISOString(),
        sequence_number: index,
      }));

      if (transcriptData.length > 0) {
        await supabase
          .from('transcripts')
          .insert(transcriptData);
      }

      // Generate and save scores (simplified example)
      const scores = [
        {
          call_id: callId,
          category: 'rapport',
          score: 75 + Math.floor(Math.random() * 20),
          feedback: 'Good connection established with prospect',
        },
        {
          call_id: callId,
          category: 'discovery',
          score: 70 + Math.floor(Math.random() * 25),
          feedback: 'Asked relevant qualifying questions',
        },
        {
          call_id: callId,
          category: 'objection_handling',
          score: 65 + Math.floor(Math.random() * 30),
          feedback: 'Addressed concerns effectively',
        },
        {
          call_id: callId,
          category: 'closing',
          score: 60 + Math.floor(Math.random() * 35),
          feedback: 'Clear next steps established',
        },
      ];

      await supabase
        .from('scores')
        .insert(scores);
    }

    setTimeout(() => {
      onEndCall();
    }, 500);
  };

  const addMessage = (speaker: 'user' | 'bot', message: string, sentiment: 'positive' | 'neutral' | 'negative' = 'neutral') => {
    const newMessage: Message = {
      id: Date.now().toString(),
      speaker,
      message,
      timestamp: new Date(),
      sentiment,
    };
    setTranscript(prev => [...prev, newMessage]);
  };

  const simulateUserMessage = () => {
    const userMessages = [
      "Hi! I wanted to discuss your solutions for our team.",
      "Can you tell me more about the pricing structure?",
      "What kind of ROI can we expect?",
      "How long does implementation typically take?",
      "Do you have any case studies in our industry?",
    ];
    const botResponses = [
      "Absolutely! I'd be happy to walk you through our solutions. What specific challenges is your team facing right now?",
      "Great question! Our pricing is flexible and scales with your team size. Can you share how many users you're looking to support?",
      "Based on similar clients in your industry, we typically see a 3-4x ROI within the first 6 months. What metrics are most important to you?",
      "Implementation usually takes 2-4 weeks depending on your setup. We provide dedicated support throughout. Do you have any specific integration requirements?",
      "Yes, we work with several companies in your space. I can share some relevant case studies. What outcomes are you most interested in seeing?",
    ];

    const randomIndex = Math.floor(Math.random() * userMessages.length);
    addMessage('user', userMessages[randomIndex], 'positive');

    setTimeout(() => {
      addMessage('bot', botResponses[randomIndex], 'neutral');
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 z-50 flex flex-col">
      <div className="bg-slate-800 border-b border-slate-700 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={endCall}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Exit Call</span>
          </button>
          <div className="text-center">
            <h2 className="text-xl font-bold text-white">
              {practiceMode === 'ai_roleplay' && 'AI Roleplay'}
              {practiceMode === 'self_practice' && 'Pitch Practice'}
            </h2>
            <p className="text-sm text-slate-400">{isCallActive ? formatDuration(callDuration) : 'Not started'}</p>
          </div>
          <div className="w-24" />
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="max-w-7xl mx-auto h-full flex gap-6 p-6">
          <div className="flex-1 flex flex-col bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
            <div className="bg-gradient-to-br from-slate-700 to-slate-800 p-6 border-b border-slate-700">
              <div className="flex items-center justify-center mb-6">
                <div
                  className="w-32 h-32 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-2xl ring-4 ring-slate-600"
                  style={{ backgroundColor: bot.avatar_color }}
                >
                  {bot.avatar_initials}
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-1">{bot.name}</h3>
                <p className="text-slate-300 mb-2">{bot.title}</p>
                <p className="text-sm text-slate-400">{bot.company}</p>
                <div className="flex items-center justify-center gap-2 mt-4">
                  <span className="px-3 py-1 bg-slate-600 text-slate-200 text-xs font-medium rounded-full">
                    {bot.personality}
                  </span>
                  <span className="px-3 py-1 bg-cyan-500 bg-opacity-20 text-cyan-300 text-xs font-medium rounded-full">
                    {bot.call_type}
                  </span>
                  {practiceMode === 'self_practice' && (
                    <span className="px-3 py-1 bg-blue-500 bg-opacity-20 text-blue-300 text-xs font-medium rounded-full">
                      Self-paced
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex-1 flex items-center justify-center p-8">
              {!isCallActive ? (
                <button
                  onClick={startCall}
                  className="group relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
                  <div className="relative w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                    <Phone className="w-12 h-12 text-white" />
                  </div>
                  <p className="text-white font-semibold mt-4 text-center">Start Call</p>
                </button>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center justify-center gap-6">
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                        isMuted
                          ? 'bg-red-500 hover:bg-red-600'
                          : 'bg-slate-600 hover:bg-slate-500'
                      }`}
                    >
                      {isMuted ? <MicOff className="w-7 h-7 text-white" /> : <Mic className="w-7 h-7 text-white" />}
                    </button>

                    <button
                      onClick={endCall}
                      className="group relative"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-rose-500 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
                      <div className="relative w-20 h-20 bg-gradient-to-br from-red-500 to-rose-600 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                        <PhoneOff className="w-10 h-10 text-white" />
                      </div>
                    </button>

                    <button
                      onClick={() => setIsSpeakerOn(!isSpeakerOn)}
                      className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                        isSpeakerOn
                          ? 'bg-slate-600 hover:bg-slate-500'
                          : 'bg-red-500 hover:bg-red-600'
                      }`}
                    >
                      {isSpeakerOn ? <Volume2 className="w-7 h-7 text-white" /> : <VolumeX className="w-7 h-7 text-white" />}
                    </button>
                  </div>

                  {practiceMode === 'ai_roleplay' && (
                    <div className="text-center">
                      <button
                        onClick={simulateUserMessage}
                        className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-medium rounded-lg transition-colors"
                      >
                        Simulate Speaking
                      </button>
                      <p className="text-xs text-slate-400 mt-2">Demo: Click to add messages to transcript</p>
                    </div>
                  )}
                  {practiceMode === 'self_practice' && (
                    <div className="text-center">
                      <p className="text-sm text-slate-300">Practice your pitch out loud</p>
                      <p className="text-xs text-slate-400 mt-2">Recording for your review</p>
                    </div>
                  )}

                  {isListening && (
                    <div className="flex items-center justify-center gap-2 text-cyan-400">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                      <span className="text-sm font-medium">Listening...</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="w-96 bg-slate-800 rounded-2xl border border-slate-700 flex flex-col overflow-hidden">
            <div className="bg-slate-700 px-6 py-4 border-b border-slate-600">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-cyan-400" />
                <h3 className="text-lg font-bold text-white">Live Transcript</h3>
              </div>
              <p className="text-xs text-slate-400 mt-1">Real-time conversation</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {transcript.length === 0 ? (
                <div className="text-center py-12">
                  <MessageSquare className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-500 text-sm">Transcript will appear here once the call starts</p>
                </div>
              ) : (
                transcript.map((msg) => (
                  <div key={msg.id} className={`flex gap-3 ${msg.speaker === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      msg.speaker === 'user'
                        ? 'bg-gradient-to-br from-cyan-500 to-blue-500'
                        : 'bg-slate-600'
                    }`}>
                      {msg.speaker === 'user' ? (
                        <User className="w-4 h-4 text-white" />
                      ) : (
                        <BotIcon className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <div className={`flex-1 ${msg.speaker === 'user' ? 'text-right' : ''}`}>
                      <div className={`inline-block px-4 py-2 rounded-lg ${
                        msg.speaker === 'user'
                          ? 'bg-gradient-to-br from-cyan-500 to-blue-500 text-white'
                          : 'bg-slate-700 text-slate-200'
                      }`}>
                        <p className="text-sm">{msg.message}</p>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 px-2">
                        {msg.timestamp.toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
