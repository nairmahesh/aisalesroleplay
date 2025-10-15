import { useState, useEffect } from 'react';
import { Calendar, Clock, Eye } from 'lucide-react';
import { Bot, supabase } from '../lib/supabase';
import { CallAnalyticsView } from './CallAnalyticsView';

interface CallRecord {
  id: string;
  botName: string;
  botInitials: string;
  botColor: string;
  date: string;
  duration: string;
  callType: string;
  framework: string;
  score: number;
  sentiment: 'Positive' | 'Neutral' | 'Negative';
  talkRatio: number;
}

export function CallHistoryView() {
  const [selectedCall, setSelectedCall] = useState<CallRecord | null>(null);
  const [viewingAnalytics, setViewingAnalytics] = useState(false);
  const [bots, setBots] = useState<Bot[]>([]);
  const [callHistory, setCallHistory] = useState<CallRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const { data: botsData, error: botsError } = await supabase
        .from('bots')
        .select('*');

      if (botsError) throw botsError;
      setBots(botsData || []);

      const { data: sessionsData, error: sessionsError } = await supabase
        .from('call_sessions')
        .select(`
          id,
          started_at,
          duration_seconds,
          status,
          bots (
            name,
            avatar_initials,
            avatar_color,
            call_type
          ),
          call_analytics (
            total_score,
            user_sentiment_score,
            user_talk_percentage,
            evaluation_framework
          )
        `)
        .eq('status', 'completed')
        .order('started_at', { ascending: false });

      if (sessionsError) throw sessionsError;

      const formattedHistory: CallRecord[] = (sessionsData || []).map((session: any) => {
        const bot = session.bots;
        const analytics = session.call_analytics;
        const sentimentScore = analytics?.user_sentiment_score || 0;

        return {
          id: session.id,
          botName: bot?.name || 'Unknown',
          botInitials: bot?.avatar_initials || '??',
          botColor: bot?.avatar_color || '#6366F1',
          date: new Date(session.started_at).toISOString().split('T')[0],
          duration: formatDuration(session.duration_seconds || 0),
          callType: bot?.call_type || 'Unknown',
          framework: analytics?.evaluation_framework || 'BANT',
          score: analytics?.total_score || 0,
          sentiment: getSentimentLabel(sentimentScore),
          talkRatio: analytics?.user_talk_percentage || 50,
        };
      });

      setCallHistory(formattedHistory);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  }

  function formatDuration(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  function getSentimentLabel(score: number): 'Positive' | 'Neutral' | 'Negative' {
    if (score >= 0.6) return 'Positive';
    if (score >= 0.3) return 'Neutral';
    return 'Negative';
  }

  function viewAnalytics(call: CallRecord) {
    setSelectedCall(call);
    setViewingAnalytics(true);
  }

  function closeAnalytics() {
    setViewingAnalytics(false);
    setSelectedCall(null);
  }

  if (viewingAnalytics && selectedCall) {
    const bot = bots.find(b => b.name === selectedCall.botName);
    if (bot) {
      return <CallAnalyticsView sessionId={selectedCall.id} bot={bot} onBack={closeAnalytics} />;
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-600">Loading call history...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Call History</h1>
        <p className="text-slate-600">Review your past roleplay sessions and analytics</p>
      </div>

      {callHistory.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <p className="text-slate-600 mb-4">No call history yet. Start practicing to see your performance analytics!</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Bot</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Date</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Duration</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Type</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Framework</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Score</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Sentiment</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {callHistory.map((call) => (
                <tr key={call.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold"
                        style={{ backgroundColor: call.botColor }}
                      >
                        {call.botInitials}
                      </div>
                      <span className="font-medium text-slate-900">{call.botName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">{call.date}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">{call.duration}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-cyan-50 text-cyan-700 text-xs font-medium rounded-full">
                      {call.callType}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-full">
                      {call.framework}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-slate-200 rounded-full h-2 w-20">
                        <div
                          className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full"
                          style={{ width: `${call.score}%` }}
                        />
                      </div>
                      <span className="font-bold text-slate-900 text-sm w-8">{call.score}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        call.sentiment === 'Positive'
                          ? 'bg-green-100 text-green-700'
                          : call.sentiment === 'Negative'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {call.sentiment}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => viewAnalytics(call)}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-medium rounded-lg transition-all text-sm"
                    >
                      <Eye className="w-4 h-4" />
                      View Analytics
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      )}
    </div>
  );
}
