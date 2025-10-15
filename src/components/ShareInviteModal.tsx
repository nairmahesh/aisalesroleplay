import { useState } from 'react';
import { X, Link2, Mail, MessageCircle, Check } from 'lucide-react';

interface ShareInviteModalProps {
  inviteToken: string;
  roomName: string;
  onClose: () => void;
}

export function ShareInviteModal({ inviteToken, roomName, onClose }: ShareInviteModalProps) {
  const [copied, setCopied] = useState(false);
  const baseUrl = window.location.origin;
  const inviteUrl = `${baseUrl}/invite?token=${inviteToken}`;

  function copyLink() {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function shareViaEmail() {
    const subject = encodeURIComponent(`Invitation to Practice Room: ${roomName}`);
    const body = encodeURIComponent(
      `You've been invited to join a sales practice session!\n\nRoom: ${roomName}\n\nClick here to join: ${inviteUrl}\n\nLooking forward to practicing with you!`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
  }

  function shareViaWhatsApp() {
    const message = encodeURIComponent(
      `You've been invited to join a sales practice session!\n\n*${roomName}*\n\nClick here to join: ${inviteUrl}`
    );
    window.open(`https://wa.me/?text=${message}`, '_blank');
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full">
        <div className="border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">Share Invite</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <p className="text-sm text-slate-600 mb-2">Room</p>
            <p className="font-semibold text-slate-900">{roomName}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Invite Link
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={inviteUrl}
                readOnly
                className="flex-1 px-4 py-2.5 border border-slate-300 rounded-lg bg-slate-50 text-slate-600 text-sm"
              />
              <button
                onClick={copyLink}
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied
                  </>
                ) : (
                  <>
                    <Link2 className="w-4 h-4" />
                    Copy
                  </>
                )}
              </button>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-slate-700 mb-3">Share via</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={shareViaEmail}
                className="flex items-center justify-center gap-3 px-4 py-3 border border-slate-300 hover:border-slate-400 rounded-lg transition-colors group"
              >
                <div className="w-10 h-10 bg-slate-100 group-hover:bg-slate-200 rounded-lg flex items-center justify-center transition-colors">
                  <Mail className="w-5 h-5 text-slate-700" />
                </div>
                <span className="font-medium text-slate-900">Email</span>
              </button>

              <button
                onClick={shareViaWhatsApp}
                className="flex items-center justify-center gap-3 px-4 py-3 border border-slate-300 hover:border-slate-400 rounded-lg transition-colors group"
              >
                <div className="w-10 h-10 bg-green-100 group-hover:bg-green-200 rounded-lg flex items-center justify-center transition-colors">
                  <MessageCircle className="w-5 h-5 text-green-700" />
                </div>
                <span className="font-medium text-slate-900">WhatsApp</span>
              </button>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <p className="text-xs text-slate-600">
              <strong>Note:</strong> This invite link is unique to this practice room. Anyone with the link can join the session.
            </p>
          </div>
        </div>

        <div className="border-t border-slate-200 px-6 py-4">
          <button
            onClick={onClose}
            className="w-full px-6 py-2.5 text-slate-600 hover:text-slate-900 font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
