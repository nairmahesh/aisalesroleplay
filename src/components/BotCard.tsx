import { Eye, Phone, Sparkles } from 'lucide-react';
import { Bot } from '../lib/supabase';

interface BotCardProps {
  bot: Bot;
  onViewDetails: (bot: Bot) => void;
  onStartCall: (bot: Bot) => void;
}

export function BotCard({ bot, onViewDetails, onStartCall }: BotCardProps) {
  return (
    <div className="bg-white rounded-xl border-2 border-slate-200 hover:border-cyan-400 transition-all hover:shadow-lg overflow-hidden">
      <div className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold flex-shrink-0"
            style={{ backgroundColor: bot.avatar_color }}
          >
            {bot.avatar_initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-cyan-500" />
              <span className="text-xs font-semibold text-slate-500 uppercase">AI</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 truncate">{bot.name}</h3>
            <p className="text-sm text-slate-600 truncate">{bot.title} at</p>
            <p className="text-sm text-slate-600 truncate">{bot.company}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-full">
            {bot.personality}
          </span>
          <span className="px-3 py-1 bg-cyan-50 text-cyan-700 text-xs font-medium rounded-full">
            {bot.call_type}
          </span>
          <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-full">
            {bot.language}
          </span>
        </div>

        <p className="text-sm text-slate-600 mb-4 line-clamp-2">
          {bot.brief_profile}
        </p>

        <div className="space-y-2">
          <button
            onClick={() => onViewDetails(bot)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium rounded-lg transition-colors"
          >
            <Eye className="w-4 h-4" />
            View Details
          </button>
          <button
            onClick={() => onStartCall(bot)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-medium rounded-lg transition-all shadow-md hover:shadow-lg"
          >
            <Phone className="w-4 h-4" />
            Start Voice Roleplay
          </button>
        </div>
      </div>
    </div>
  );
}
