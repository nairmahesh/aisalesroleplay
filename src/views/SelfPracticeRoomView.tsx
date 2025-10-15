import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Send, Loader2, CheckCircle2 } from 'lucide-react';
import { Bot, supabase } from '../lib/supabase';

interface Message {
  id: string;
  role: 'user' | 'system';
  content: string;
  timestamp: Date;
}

interface SelfPracticeRoomViewProps {
  bot: Bot;
  onEndCall: () => void;
}

export function SelfPracticeRoomView({ bot, onEndCall }: SelfPracticeRoomViewProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const [isPracticeComplete, setIsPracticeComplete] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initializeSession();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  async function initializeSession() {
    const newSessionId = `session-${Date.now()}`;
    setSessionId(newSessionId);

    const welcomeMessage: Message = {
      id: `msg-${Date.now()}`,
      role: 'system',
      content: `Welcome to Self Practice mode! You're practicing with **${bot.name}** (${bot.title} at ${bot.company}).\n\n**Scenario:** ${bot.scenario}\n\n**Your goal:** ${bot.objection || 'Practice your pitch and communication skills'}\n\nType your pitch or responses below. When you're done, I'll provide detailed feedback on your performance.`,
      timestamp: new Date(),
    };

    setMessages([welcomeMessage]);

    const { error } = await supabase.from('call_sessions').insert([
      {
        bot_id: bot.id,
        practice_mode: 'self_practice',
        status: 'active',
        started_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      console.error('Error creating session:', error);
    }
  }

  async function handleSendMessage() {
    if (!inputMessage.trim() || isSubmitting) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsSubmitting(true);

    const systemMessage: Message = {
      id: `msg-${Date.now() + 1}`,
      role: 'system',
      content: 'Message recorded. Continue with your pitch, or type "done" when you want to finish and get feedback.',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, systemMessage]);
    setIsSubmitting(false);
  }

  async function handleFinishPractice() {
    setIsSubmitting(true);

    const transcript = messages
      .filter((m) => m.role === 'user')
      .map((m) => m.content)
      .join('\n\n');

    const feedbackMessage: Message = {
      id: `msg-${Date.now()}`,
      role: 'system',
      content: `**Practice Complete!**\n\nThank you for practicing. Your responses have been recorded and will be analyzed for feedback.\n\n**Next Steps:**\n- Check the Call History to see your detailed performance analysis\n- Review scoring across different criteria\n- Get actionable recommendations for improvement\n\nClick "End Practice" to finish and view your results.`,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, feedbackMessage]);
    setIsPracticeComplete(true);
    setIsSubmitting(false);

    await supabase
      .from('call_sessions')
      .update({
        status: 'completed',
        ended_at: new Date().toISOString(),
        transcript: transcript,
      })
      .eq('bot_id', bot.id)
      .eq('practice_mode', 'self_practice')
      .order('created_at', { ascending: false })
      .limit(1);
  }

  function handleKeyPress(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <button
            onClick={onEndCall}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Exit Practice</span>
          </button>
          <div className="text-center">
            <h2 className="text-xl font-bold text-slate-900">Self Practice</h2>
            <p className="text-sm text-slate-600">
              {bot.name} - {bot.title}
            </p>
          </div>
          <div className="w-24"></div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="max-w-5xl mx-auto h-full flex flex-col">
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-3xl rounded-2xl px-6 py-4 ${
                    message.role === 'user'
                      ? 'bg-slate-900 text-white'
                      : 'bg-white border border-slate-200 text-slate-900'
                  }`}
                >
                  <div className="prose prose-sm max-w-none">
                    {message.content.split('\n').map((line, i) => {
                      if (line.startsWith('**') && line.endsWith('**')) {
                        return (
                          <p key={i} className="font-bold mb-2 text-inherit">
                            {line.replace(/\*\*/g, '')}
                          </p>
                        );
                      }
                      return line ? (
                        <p key={i} className="mb-2 text-inherit">
                          {line}
                        </p>
                      ) : (
                        <br key={i} />
                      );
                    })}
                  </div>
                  <div
                    className={`text-xs mt-2 ${
                      message.role === 'user' ? 'text-slate-400' : 'text-slate-500'
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
            {isSubmitting && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 rounded-2xl px-6 py-4">
                  <Loader2 className="w-5 h-5 text-cyan-500 animate-spin" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-slate-200 bg-white p-6">
            <div className="max-w-4xl mx-auto">
              {!isPracticeComplete ? (
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <textarea
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your pitch or response here..."
                      rows={3}
                      className="flex-1 px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none resize-none"
                      disabled={isSubmitting}
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!inputMessage.trim() || isSubmitting}
                      className="px-6 bg-slate-900 hover:bg-slate-800 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-slate-600">
                      Type your pitch step by step. Press Enter to send each message.
                    </p>
                    <button
                      onClick={handleFinishPractice}
                      disabled={messages.filter((m) => m.role === 'user').length === 0}
                      className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Finish & Get Feedback
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <button
                    onClick={onEndCall}
                    className="px-8 py-3 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg transition-colors"
                  >
                    End Practice
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
