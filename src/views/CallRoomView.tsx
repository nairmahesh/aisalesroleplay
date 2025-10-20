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
  const { currentUser } = useAuth();
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [transcript, setTranscript] = useState<Message[]>([]);
  const [callDuration, setCallDuration] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [callId, setCallId] = useState<string | null>(null);
  const [callStartTime, setCallStartTime] = useState<Date | null>(null);
  const [recognition, setRecognition] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const getLanguageCode = (language: string): string => {
    const languageMap: Record<string, string> = {
      'English': 'en-US',
      'Spanish': 'es-ES',
      'French': 'fr-FR',
      'German': 'de-DE',
      'Italian': 'it-IT',
      'Portuguese': 'pt-BR',
      'Arabic': 'ar-SA',
      'Hindi': 'hi-IN',
      'Tamil': 'ta-IN',
      'Marathi': 'mr-IN',
      'Gujarati': 'gu-IN',
      'Malayalam': 'ml-IN',
      'Swahili': 'sw-KE',
    };
    return languageMap[language] || 'en-US';
  };

  const handleUserSpeech = async (speechText: string) => {
    if (!speechText.trim()) return;

    setIsProcessing(true);
    console.log('User said:', speechText);
    addMessage('user', speechText, 'neutral');

    setTimeout(() => {
      const response = generateBotResponse(speechText, bot.personality);
      addMessage('bot', response, 'neutral');
      setIsProcessing(false);
    }, 1500);
  };

  const generateBotResponse = (userInput: string, personality: string): string => {
    const input = userInput.toLowerCase();

    const responses: Record<string, Record<string, string>> = {
      friendly: {
        greeting: "Hi there! It's great to connect with you. How can I help you today?",
        pricing: "I'd love to discuss our pricing! It's very flexible and designed to fit different needs. What's your budget range?",
        objection: "I totally understand your concern. Let me share how we've helped others in similar situations.",
        default: "That's a great point! Tell me more about what you're thinking.",
      },
      professional: {
        greeting: "Hello. Thank you for reaching out. How may I assist you?",
        pricing: "I can provide detailed pricing information. Our structure is transparent and based on your specific requirements.",
        objection: "I appreciate you bringing that up. Let me address that concern directly.",
        default: "I see. Could you elaborate on that?",
      },
      skeptical: {
        greeting: "Yeah? What is this about?",
        pricing: "Look, I've heard a lot of pitches. What makes yours different?",
        objection: "I've heard that before. Prove it.",
        default: "Uh-huh. Go on.",
      },
      analytical: {
        greeting: `Hello, this is ${bot.name}. I prefer data-driven conversations. What metrics matter to you?`,
        pricing: "Let's discuss ROI and concrete numbers. What KPIs are you tracking?",
        objection: "Interesting point. Do you have data to support that concern?",
        default: "Could you provide more specific details or data points?",
      },
      enthusiastic: {
        greeting: "Hi! This is exciting! What can I help you with?",
        pricing: "Oh, I love talking about our solutions! The value we provide is amazing. What's your biggest challenge?",
        objection: "I'm so glad you asked! Let me show you why this works so well!",
        default: "Yes! That's exactly what we help with! Tell me more!",
      },
      rude: {
        greeting: "What? Make it quick.",
        pricing: "You're calling ME about pricing? Why should I care?",
        objection: "Yeah, yeah. Everyone says that. You got anything new?",
        default: "So?",
      },
    };

    const personalityResponses = responses[personality.toLowerCase()] || responses.professional;

    if (input.includes('hi') || input.includes('hello') || input.includes('hey') || input.includes('നമസ്കാരം') || input.includes('ഹലോ')) {
      return personalityResponses.greeting;
    } else if (input.includes('price') || input.includes('cost') || input.includes('pricing') || input.includes('വില')) {
      return personalityResponses.pricing;
    } else if (input.includes('concern') || input.includes('worried') || input.includes('not sure')) {
      return personalityResponses.objection;
    } else {
      return personalityResponses.default;
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isCallActive) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCallActive]);

  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }

    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      const langCode = getLanguageCode(bot.language);

      console.log('Initializing speech recognition for:', bot.language, 'Code:', langCode);

      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = langCode;
      recognitionInstance.maxAlternatives = 3;

      recognitionInstance.onstart = () => {
        console.log('Speech recognition started');
        setIsListening(true);
      };

      recognitionInstance.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        if (finalTranscript && !isProcessing) {
          console.log('Final transcript:', finalTranscript);
          handleUserSpeech(finalTranscript);
        }
      };

      recognitionInstance.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'no-speech') {
          console.log('No speech detected, continuing to listen...');
        } else if (event.error === 'not-allowed') {
          alert('Microphone access is required. Please allow microphone access and try again.');
        }
        setIsListening(false);
      };

      recognitionInstance.onend = () => {
        console.log('Speech recognition ended');
        setIsListening(false);
        if (isCallActive && !isMuted) {
          try {
            recognitionInstance.start();
          } catch (e) {
            console.error('Error restarting recognition:', e);
          }
        }
      };

      setRecognition(recognitionInstance);
    } else {
      console.error('Speech recognition not supported in this browser');
      alert('Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.');
    }

    return () => {
      if (recognition) {
        try {
          recognition.stop();
        } catch (e) {
          console.error('Error stopping recognition:', e);
        }
      }
    };
  }, [bot.language]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startCall = async () => {
    if (!currentUser) return;

    setCallStartTime(new Date());
    setIsCallActive(true);

    // Create call record in database
    const { data: newCall, error } = await supabase
      .from('calls')
      .insert({
        bot_id: bot.id,
        user_id: currentUser.id,
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

    // Start speech recognition
    if (recognition && practiceMode === 'ai_roleplay') {
      try {
        recognition.start();
      } catch (error) {
        console.error('Error starting speech recognition:', error);
      }
    }

    // Only AI bot responds automatically
    if (practiceMode === 'ai_roleplay') {
      setTimeout(() => {
        const greetings = {
          friendly: `Hello?`,
          professional: `Hello?`,
          skeptical: `Yeah?`,
          analytical: `Hello, this is ${bot.name}.`,
          enthusiastic: `Hello!`,
          rude: `What?`,
        };

        const greeting = greetings[bot.personality.toLowerCase() as keyof typeof greetings] || greetings.professional;
        addMessage('bot', greeting, 'neutral');
      }, 800);
    }
  };

  const endCall = async () => {
    setIsCallActive(false);

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }

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

  const speakMessage = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);

      // Configure voice characteristics based on personality
      const personalityConfig = {
        friendly: { rate: 1.0, pitch: 1.1, volume: 1.0 },
        professional: { rate: 0.95, pitch: 1.0, volume: 1.0 },
        skeptical: { rate: 0.9, pitch: 0.9, volume: 0.9 },
        analytical: { rate: 0.85, pitch: 0.95, volume: 1.0 },
        enthusiastic: { rate: 1.1, pitch: 1.2, volume: 1.0 },
        rude: { rate: 1.0, pitch: 0.85, volume: 1.0 },
      };

      const config = personalityConfig[bot.personality.toLowerCase() as keyof typeof personalityConfig] || personalityConfig.professional;
      utterance.rate = config.rate;
      utterance.pitch = config.pitch;
      utterance.volume = config.volume;

      const voices = window.speechSynthesis.getVoices();
      const langCode = getLanguageCode(bot.language);

      // Find voice matching bot's language and gender preference
      let preferredVoice = voices.find(voice => {
        const matchesLanguage = voice.lang.startsWith(langCode.split('-')[0]);
        const isMale = bot.name.includes('Ahmed') || bot.name.includes('Karthik') || bot.name.includes('Aditya') || bot.name.includes('Rahul');
        const voiceGender = voice.name.toLowerCase().includes('male') ? 'male' : voice.name.toLowerCase().includes('female') ? 'female' : null;

        if (matchesLanguage) {
          if (voiceGender === null) return true;
          return isMale ? voiceGender === 'male' : voiceGender === 'female';
        }
        return false;
      });

      // Fallback to any voice in the language
      if (!preferredVoice) {
        preferredVoice = voices.find(voice => voice.lang.startsWith(langCode.split('-')[0]));
      }

      // Final fallback to English
      if (!preferredVoice) {
        preferredVoice = voices.find(voice =>
          voice.name.includes('Google') ||
          voice.name.includes('Microsoft') ||
          voice.lang.startsWith('en')
        );
      }

      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      utterance.lang = langCode;
      window.speechSynthesis.speak(utterance);
    }
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

    if (speaker === 'bot' && isSpeakerOn) {
      speakMessage(message);
    }
  };

  const simulateUserMessage = () => {
    const userMessages = [
      "Hi! I wanted to discuss your solutions for our team.",
      "Can you tell me more about the pricing structure?",
      "What kind of ROI can we expect?",
      "How long does implementation typically take?",
      "Do you have any case studies in our industry?",
    ];

    const randomIndex = Math.floor(Math.random() * userMessages.length);
    handleUserSpeech(userMessages[randomIndex]);
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
                      onClick={() => {
                        const newMutedState = !isMuted;
                        setIsMuted(newMutedState);
                        if (recognition) {
                          if (newMutedState) {
                            recognition.stop();
                          } else {
                            recognition.start();
                          }
                        }
                      }}
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
                      {isListening && (
                        <div className="flex items-center justify-center gap-2 mb-3">
                          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                          <span className="text-sm text-red-400 font-medium">Listening...</span>
                        </div>
                      )}
                      <button
                        onClick={simulateUserMessage}
                        className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-medium rounded-lg transition-colors"
                      >
                        Simulate Speaking
                      </button>
                      <p className="text-xs text-slate-400 mt-2">Speak naturally or click to simulate</p>
                    </div>
                  )}
                  {practiceMode === 'self_practice' && (
                    <div className="text-center">
                      <p className="text-sm text-slate-300">Practice your pitch out loud</p>
                      <p className="text-xs text-slate-400 mt-2">Recording for your review</p>
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
