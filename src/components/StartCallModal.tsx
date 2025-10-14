import { Phone } from 'lucide-react';
import { Bot } from '../lib/supabase';

interface StartCallModalProps {
  bot: Bot;
  onConfirm: () => void;
  onCancel: () => void;
}

export function StartCallModal({ onConfirm, onCancel }: StartCallModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        <h3 className="text-xl font-bold text-slate-900 mb-3">Let's get started!</h3>
        <p className="text-slate-600 mb-6 leading-relaxed">
          At times, the bot may be unresponsive, or have unusual lag times. We are always working to improve the experience! Your call will be visible to other platform users in your organization.
        </p>
        <button
          onClick={onConfirm}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg transition-colors"
        >
          <Phone className="w-5 h-5" />
          I understand, start call
        </button>
        <button
          onClick={onCancel}
          className="w-full mt-3 px-6 py-3 text-slate-600 hover:text-slate-900 font-medium transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
