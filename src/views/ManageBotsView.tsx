import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Sparkles } from 'lucide-react';
import { Bot, supabase } from '../lib/supabase';
import { CreateBotModal } from '../components/CreateBotModal';

export function ManageBotsView() {
  const [bots, setBots] = useState<Bot[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchBots();
  }, []);

  async function fetchBots() {
    try {
      const { data, error } = await supabase
        .from('bots')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBots(data || []);
    } catch (error) {
      console.error('Error fetching bots:', error);
    } finally {
      setLoading(false);
    }
  }

  async function toggleBotStatus(botId: string, currentStatus: boolean) {
    try {
      const { error } = await supabase
        .from('bots')
        .update({ is_active: !currentStatus })
        .eq('id', botId);

      if (error) throw error;
      fetchBots();
    } catch (error) {
      console.error('Error updating bot:', error);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-slate-600">Loading bots...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Manage Bots</h1>
          <p className="text-slate-600">Create and configure AI personas for roleplay</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Create New Bot
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Bot</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Industry</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Call Type</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Personality</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Status</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {bots.map((bot) => (
                <tr key={bot.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold"
                        style={{ backgroundColor: bot.avatar_color }}
                      >
                        {bot.avatar_initials}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{bot.name}</p>
                        <p className="text-sm text-slate-600">{bot.title}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-700">{bot.industry}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-cyan-50 text-cyan-700 text-xs font-medium rounded-full">
                      {bot.call_type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-full">
                      {bot.personality}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleBotStatus(bot.id, bot.is_active)}
                      className={`px-3 py-1 text-xs font-semibold rounded-full transition-colors ${
                        bot.is_active
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                      }`}
                    >
                      {bot.is_active ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-slate-600 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-6 text-white">
        <div className="flex items-center gap-3 mb-3">
          <Sparkles className="w-6 h-6 text-cyan-400" />
          <h3 className="text-lg font-bold">Bot Creation Tips</h3>
        </div>
        <ul className="space-y-2 text-slate-300">
          <li className="flex items-start gap-2">
            <span className="text-cyan-400 mt-1">•</span>
            <span>Create diverse personalities to challenge different selling scenarios</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-cyan-400 mt-1">•</span>
            <span>Include specific dos and don'ts to guide practice sessions</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-cyan-400 mt-1">•</span>
            <span>Match call types and personalities to real-world prospects</span>
          </li>
        </ul>
      </div>

      {showCreateModal && (
        <CreateBotModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            fetchBots();
            setShowCreateModal(false);
          }}
        />
      )}
    </div>
  );
}
