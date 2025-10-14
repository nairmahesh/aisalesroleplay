import { X, Sparkles, CheckCircle, XCircle, Phone } from 'lucide-react';
import { Bot } from '../lib/supabase';

interface BotDetailsModalProps {
  bot: Bot;
  onClose: () => void;
  onStartCall: (bot: Bot) => void;
}

export function BotDetailsModal({ bot, onClose, onStartCall }: BotDetailsModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-slate-50 to-white">
          <div className="flex items-center gap-4">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold"
              style={{ backgroundColor: bot.avatar_color }}
            >
              {bot.avatar_initials}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-cyan-500" />
                <span className="text-xs font-semibold text-slate-500 uppercase">AI Persona</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900">{bot.name}</h2>
              <p className="text-slate-600">{bot.title}</p>
              <p className="text-sm text-slate-500">{bot.company}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors text-slate-500 hover:text-slate-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
                Call Details
              </h3>
              <div className="flex flex-wrap gap-2">
                <span className="px-4 py-2 bg-slate-100 text-slate-800 text-sm font-medium rounded-lg">
                  Industry: {bot.industry}
                </span>
                <span className="px-4 py-2 bg-cyan-50 text-cyan-700 text-sm font-medium rounded-lg">
                  {bot.call_type}
                </span>
                <span className="px-4 py-2 bg-slate-100 text-slate-800 text-sm font-medium rounded-lg">
                  Personality: {bot.personality}
                </span>
                <span className="px-4 py-2 bg-slate-100 text-slate-800 text-sm font-medium rounded-lg">
                  {bot.language}
                </span>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
                About {bot.name.split(' ')[0]}
              </h3>
              <p className="text-slate-700 leading-relaxed">{bot.detailed_profile}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-green-50 rounded-xl p-5 border border-green-200">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <h3 className="font-bold text-green-900">Do's</h3>
                </div>
                <ul className="space-y-2">
                  {bot.dos.map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-green-800">
                      <span className="text-green-600 mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-red-50 rounded-xl p-5 border border-red-200">
                <div className="flex items-center gap-2 mb-4">
                  <XCircle className="w-5 h-5 text-red-600" />
                  <h3 className="font-bold text-red-900">Don'ts</h3>
                </div>
                <ul className="space-y-2">
                  {bot.donts.map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-red-800">
                      <span className="text-red-600 mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-200 bg-slate-50">
          <button
            onClick={() => onStartCall(bot)}
            className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl text-lg"
          >
            <Phone className="w-5 h-5" />
            Start Voice Roleplay
          </button>
        </div>
      </div>
    </div>
  );
}
