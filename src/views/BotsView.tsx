import { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import { Bot, supabase } from '../lib/supabase';
import { BotCard } from '../components/BotCard';
import { BotDetailsModal } from '../components/BotDetailsModal';
import { StartCallModal } from '../components/StartCallModal';
import { CallRoomView } from './CallRoomView';
import { PracticeMode } from '../components/PracticeModeSelector';

export function BotsView() {
  const [bots, setBots] = useState<Bot[]>([]);
  const [filteredBots, setFilteredBots] = useState<Bot[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('All Industries');
  const [selectedCallType, setSelectedCallType] = useState('All Call Types');
  const [selectedBot, setSelectedBot] = useState<Bot | null>(null);
  const [startCallBot, setStartCallBot] = useState<Bot | null>(null);
  const [activeCallBot, setActiveCallBot] = useState<Bot | null>(null);
  const [selectedPracticeMode, setSelectedPracticeMode] = useState<PracticeMode>('ai_roleplay');

  useEffect(() => {
    fetchBots();
  }, []);

  useEffect(() => {
    filterBots();
  }, [bots, searchQuery, selectedIndustry, selectedCallType]);

  async function fetchBots() {
    try {
      const { data, error } = await supabase
        .from('bots')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBots(data || []);
    } catch (error) {
      console.error('Error fetching bots:', error);
    } finally {
      setLoading(false);
    }
  }

  function filterBots() {
    let filtered = bots;

    if (searchQuery) {
      filtered = filtered.filter(
        (bot) =>
          bot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          bot.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          bot.company.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedIndustry !== 'All Industries') {
      filtered = filtered.filter((bot) => bot.industry === selectedIndustry);
    }

    if (selectedCallType !== 'All Call Types') {
      filtered = filtered.filter((bot) => bot.call_type === selectedCallType);
    }

    setFilteredBots(filtered);
  }

  const industries = ['All Industries', ...Array.from(new Set(bots.map((b) => b.industry)))];
  const callTypes = ['All Call Types', ...Array.from(new Set(bots.map((b) => b.call_type)))];

  function handleStartCall(bot: Bot) {
    setStartCallBot(bot);
  }

  function confirmStartCall(mode: PracticeMode) {
    if (startCallBot) {
      setSelectedPracticeMode(mode);
      setActiveCallBot(startCallBot);
    }
    setStartCallBot(null);
    setSelectedBot(null);
  }

  function handleEndCall() {
    setActiveCallBot(null);
  }

  if (activeCallBot) {
    return <CallRoomView bot={activeCallBot} practiceMode={selectedPracticeMode} onEndCall={handleEndCall} />;
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
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Available Bots</h1>
        <p className="text-slate-600">
          {filteredBots.length} bot{filteredBots.length !== 1 ? 's' : ''} found
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search bots by name, title, or company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
            />
          </div>

          <div className="flex gap-3">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <select
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                className="pl-10 pr-8 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none appearance-none bg-white cursor-pointer"
              >
                {industries.map((industry) => (
                  <option key={industry} value={industry}>
                    {industry}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <select
                value={selectedCallType}
                onChange={(e) => setSelectedCallType(e.target.value)}
                className="pl-10 pr-8 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none appearance-none bg-white cursor-pointer"
              >
                {callTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBots.map((bot) => (
          <BotCard
            key={bot.id}
            bot={bot}
            onViewDetails={setSelectedBot}
            onStartCall={handleStartCall}
          />
        ))}
      </div>

      {filteredBots.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-500">No bots found matching your criteria.</p>
        </div>
      )}

      {selectedBot && (
        <BotDetailsModal
          bot={selectedBot}
          onClose={() => setSelectedBot(null)}
          onStartCall={handleStartCall}
        />
      )}

      {startCallBot && (
        <StartCallModal
          bot={startCallBot}
          onConfirm={confirmStartCall}
          onCancel={() => setStartCallBot(null)}
        />
      )}
    </div>
  );
}
