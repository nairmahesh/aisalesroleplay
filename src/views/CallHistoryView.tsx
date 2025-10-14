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

  useEffect(() => {
    fetchBots();
  }, []);

  async function fetchBots() {
    try {
      const { data, error } = await supabase
        .from('bots')
        .select('*');

      if (error) throw error;
      setBots(data || []);
    } catch (error) {
      console.error('Error fetching bots:', error);
    }
  }

  function viewAnalytics(call: CallRecord) {
    setSelectedCall(call);
    setViewingAnalytics(true);
  }

  function closeAnalytics() {
    setViewingAnalytics(false);
    setSelectedCall(null);
  }

  const callHistory: CallRecord[] = [
    {
      id: '1',
      botName: 'Marcus Johnson',
      botInitials: 'MJ',
      botColor: '#6366F1',
      date: '2025-10-14',
      duration: '12:34',
      callType: 'Cold Call',
      framework: 'BANT',
      score: 82,
      sentiment: 'Positive',
      talkRatio: 45,
    },
    {
      id: '2',
      botName: 'Sarah Chen',
      botInitials: 'SC',
      botColor: '#8B5CF6',
      date: '2025-10-13',
      duration: '15:22',
      callType: 'Discovery Call',
      framework: 'MEDDIC',
      score: 75,
      sentiment: 'Neutral',
      talkRatio: 52,
    },
    {
      id: '3',
      botName: 'Emma Thompson',
      botInitials: 'ET',
      botColor: '#6366F1',
      date: '2025-10-12',
      duration: '18:45',
      callType: 'Warm Call',
      framework: 'SPIN',
      score: 88,
      sentiment: 'Positive',
      talkRatio: 40,
    },
    {
      id: '4',
      botName: 'David Kim',
      botInitials: 'DK',
      botColor: '#6366F1',
      date: '2025-10-11',
      duration: '10:15',
      callType: 'Negotiation',
      framework: 'BANT',
      score: 68,
      sentiment: 'Neutral',
      talkRatio: 58,
    },
    {
      id: '5',
      botName: 'Isabella Rodriguez',
      botInitials: 'IR',
      botColor: '#8B5CF6',
      date: '2025-10-10',
      duration: '14:30',
      callType: 'Renewal Call',
      framework: 'MEDDPICC',
      score: 91,
      sentiment: 'Positive',
      talkRatio: 42,
    },
  ];

  if (viewingAnalytics && selectedCall) {
    const bot = bots.find(b => b.name === selectedCall.botName);
    if (bot) {
      return <CallAnalyticsView sessionId={selectedCall.id} bot={bot} onBack={closeAnalytics} />;
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Call History</h1>
        <p className="text-slate-600">Review your past roleplay sessions and analytics</p>
      </div>

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
    </div>
  );
}
