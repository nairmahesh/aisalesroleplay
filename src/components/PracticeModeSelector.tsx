import { Bot as BotIcon } from 'lucide-react';

export type PracticeMode = 'ai_roleplay';

interface PracticeModeSelectorProps {
  selectedMode: PracticeMode;
  onSelectMode: (mode: PracticeMode) => void;
}

export function PracticeModeSelector({ selectedMode, onSelectMode }: PracticeModeSelectorProps) {
  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-slate-900 mb-2">AI Roleplay Practice</h3>
        <p className="text-slate-600">Interactive conversation with an AI version of the prospect</p>
      </div>

      <div className="flex justify-center">
        <button
          onClick={() => onSelectMode('ai_roleplay')}
          className="group relative p-6 rounded-xl border-2 border-violet-500 bg-violet-50 shadow-lg max-w-md w-full"
        >
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-16 h-16 rounded-full flex items-center justify-center bg-violet-100">
              <BotIcon className="w-8 h-8 text-violet-600" />
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
