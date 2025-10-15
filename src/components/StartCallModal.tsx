import { Phone } from 'lucide-react';
import { Bot } from '../lib/supabase';
import { useState } from 'react';
import { PracticeModeSelector, PracticeMode } from './PracticeModeSelector';

interface StartCallModalProps {
  bot: Bot;
  onConfirm: (mode: PracticeMode) => void;
  onCancel: () => void;
}

export function StartCallModal({ onConfirm, onCancel }: StartCallModalProps) {
  const [selectedMode, setSelectedMode] = useState<PracticeMode>('ai_roleplay');
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleModeSelection = () => {
    setShowConfirmation(true);
  };

  const handleConfirm = () => {
    onConfirm(selectedMode);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full p-8">
        {!showConfirmation ? (
          <>
            <PracticeModeSelector
              selectedMode={selectedMode}
              onSelectMode={setSelectedMode}
            />
            <div className="mt-8 flex gap-3 justify-end">
              <button
                onClick={onCancel}
                className="px-6 py-3 text-slate-600 hover:text-slate-900 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleModeSelection}
                className="flex items-center justify-center gap-2 px-8 py-3 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg transition-colors"
              >
                Continue
              </button>
            </div>
          </>
        ) : (
          <>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Let's get started!</h3>
            <p className="text-slate-600 mb-6 leading-relaxed">
              {selectedMode === 'ai_roleplay' && (
                "You'll be practicing with an AI version of the prospect. The bot may occasionally have response delays. Your call will be visible to other platform users in your organization."
              )}
              {selectedMode === 'self_practice' && (
                "You'll record your pitch without real-time interaction. You can review and get feedback afterward. Your recording will be visible to other platform users in your organization."
              )}
            </p>
            <button
              onClick={handleConfirm}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg transition-colors"
            >
              <Phone className="w-5 h-5" />
              I understand, start practice
            </button>
            <button
              onClick={() => setShowConfirmation(false)}
              className="w-full mt-3 px-6 py-3 text-slate-600 hover:text-slate-900 font-medium transition-colors"
            >
              Back
            </button>
          </>
        )}
      </div>
    </div>
  );
}
