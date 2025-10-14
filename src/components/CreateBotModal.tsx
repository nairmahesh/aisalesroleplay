import { X, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '../lib/supabase';

interface CreateBotModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateBotModal({ onClose, onSuccess }: CreateBotModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    company: '',
    industry: 'Technology',
    personality: 'Analytical',
    call_type: 'Discovery Call',
    language: 'English (US)',
    brief_profile: '',
    detailed_profile: '',
    dos: '',
    donts: '',
  });

  const [loading, setLoading] = useState(false);

  const industries = [
    'Technology',
    'Sales & Marketing',
    'Environmental Services',
    'Manufacturing',
    'Marketing & Advertising',
    'Healthcare',
    'Finance',
    'Retail',
    'Education',
  ];

  const personalities = [
    'Analytical',
    'Nice',
    'Formal',
    'Rude',
    'Chatty',
    'Reserved',
    'Enthusiastic',
  ];

  const callTypes = [
    'Discovery Call',
    'Cold Call',
    'Renewal Call',
    'Negotiation',
    'Warm Call',
    'Check-in Call',
    'Demo Call',
    'Follow-up',
  ];

  const avatarColors = [
    '#6366F1',
    '#8B5CF6',
    '#EC4899',
    '#F59E0B',
    '#10B981',
    '#06B6D4',
    '#3B82F6',
  ];

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRandomColor = () => {
    return avatarColors[Math.floor(Math.random() * avatarColors.length)];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const dosArray = formData.dos
        .split('\n')
        .filter((item) => item.trim())
        .map((item) => item.trim());
      const dontsArray = formData.donts
        .split('\n')
        .filter((item) => item.trim())
        .map((item) => item.trim());

      const { error } = await supabase.from('bots').insert([
        {
          name: formData.name,
          title: formData.title,
          company: formData.company,
          industry: formData.industry,
          personality: formData.personality,
          call_type: formData.call_type,
          language: formData.language,
          avatar_initials: getInitials(formData.name),
          avatar_color: getRandomColor(),
          brief_profile: formData.brief_profile,
          detailed_profile: formData.detailed_profile,
          dos: dosArray,
          donts: dontsArray,
          is_active: true,
        },
      ]);

      if (error) throw error;

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error creating bot:', error);
      alert('Failed to create bot. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Create New Bot</h2>
                <p className="text-sm text-slate-600">Configure a new AI persona for roleplay</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors text-slate-500 hover:text-slate-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
                  placeholder="e.g., John Smith"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
                  placeholder="e.g., VP of Sales"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Company <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
                  placeholder="e.g., Acme Corp"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Industry <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
                >
                  {industries.map((industry) => (
                    <option key={industry} value={industry}>
                      {industry}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Personality <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.personality}
                  onChange={(e) => setFormData({ ...formData, personality: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
                >
                  {personalities.map((personality) => (
                    <option key={personality} value={personality}>
                      {personality}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Call Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.call_type}
                  onChange={(e) => setFormData({ ...formData, call_type: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
                >
                  {callTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Brief Profile <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.brief_profile}
                onChange={(e) => setFormData({ ...formData, brief_profile: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
                placeholder="Short one-line description"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Detailed Profile <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={4}
                value={formData.detailed_profile}
                onChange={(e) => setFormData({ ...formData, detailed_profile: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none resize-none"
                placeholder="Detailed background, context, and role information"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Do's (one per line)
                </label>
                <textarea
                  rows={5}
                  value={formData.dos}
                  onChange={(e) => setFormData({ ...formData, dos: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none resize-none"
                  placeholder="Recommended practices&#10;Ask about budget&#10;Build rapport first"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Don'ts (one per line)
                </label>
                <textarea
                  rows={5}
                  value={formData.donts}
                  onChange={(e) => setFormData({ ...formData, donts: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none resize-none"
                  placeholder="Things to avoid&#10;Don't be pushy&#10;Don't skip discovery"
                />
              </div>
            </div>
          </div>
        </form>

        <div className="p-6 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 text-slate-700 hover:text-slate-900 font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Bot'}
          </button>
        </div>
      </div>
    </div>
  );
}
