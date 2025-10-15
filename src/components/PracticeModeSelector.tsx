import { Mic, Bot as BotIcon } from 'lucide-react';

export type PracticeMode = 'ai_roleplay' | 'self_practice';

interface PracticeModeSelectorProps {
  selectedMode: PracticeMode;
  onSelectMode: (mode: PracticeMode) => void;
}

export function PracticeModeSelector({ selectedMode, onSelectMode }: PracticeModeSelectorProps) {
  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-slate-900 mb-2">How would you like to practice?</h3>
        <p className="text-slate-600">Choose the practice mode that fits your learning style and available time</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => onSelectMode('self_practice')}
          className={`group relative p-6 rounded-xl border-2 transition-all ${
            selectedMode === 'self_practice'
              ? 'border-cyan-500 bg-cyan-50 shadow-lg'
              : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'
          }`}
        >
          <div className="flex flex-col items-center text-center space-y-3">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
              selectedMode === 'self_practice' ? 'bg-cyan-100' : 'bg-slate-100'
            }`}>
              <Mic className={`w-8 h-8 ${
                selectedMode === 'self_practice' ? 'text-cyan-600' : 'text-slate-600'
              }`} />
            </div>
            <div>
              <h4 className="font-bold text-lg text-slate-900 mb-1">Pitch Practice</h4>
              <p className="text-sm text-slate-600 mb-3">
                Record your pitch and get feedback from AI or colleagues
              </p>
              <div className="flex items-center justify-center gap-2 text-xs">
                <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded-full font-medium">Quick</span>
                <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded-full font-medium">Self-paced</span>
              </div>
            </div>
          </div>
        </button>

        <button
          onClick={() => onSelectMode('ai_roleplay')}
          className={`group relative p-6 rounded-xl border-2 transition-all ${
            selectedMode === 'ai_roleplay'
              ? 'border-violet-500 bg-violet-50 shadow-lg'
              : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'
          }`}
        >
          <div className="flex flex-col items-center text-center space-y-3">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
              selectedMode === 'ai_roleplay' ? 'bg-violet-100' : 'bg-slate-100'
            }`}>
              <BotIcon className={`w-8 h-8 ${
                selectedMode === 'ai_roleplay' ? 'text-violet-600' : 'text-slate-600'
              }`} />
            </div>
            <div>
              <h4 className="font-bold text-lg text-slate-900 mb-1">AI Roleplay</h4>
              <p className="text-sm text-slate-600 mb-3">
                Interactive conversation with an AI version of the prospect
              </p>
              <div className="flex items-center justify-center gap-2 text-xs">
                <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded-full font-medium">Interactive</span>
                <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded-full font-medium">24/7 Available</span>
              </div>
            </div>
          </div>
        </button>

      </div>
    </div>
  );
}
