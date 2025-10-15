import { useState } from 'react';
import { X } from 'lucide-react';

interface CreateRoomModalProps {
  onClose: () => void;
  onCreateRoom: (roomData: RoomFormData) => void;
}

export interface RoomFormData {
  name: string;
  rep_name: string;
  client_name: string;
  client_company: string;
  client_designation: string;
  company_description: string;
  call_objective: string;
  call_cta: string;
}

export function CreateRoomModal({ onClose, onCreateRoom }: CreateRoomModalProps) {
  const [formData, setFormData] = useState<RoomFormData>({
    name: '',
    rep_name: '',
    client_name: '',
    client_company: '',
    client_designation: '',
    company_description: '',
    call_objective: '',
    call_cta: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateRoom(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">Create Practice Room</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Room Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Room Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Discovery Call Practice - SaaS"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
                  required
                />
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Sales Rep Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Rep Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="rep_name"
                  value={formData.rep_name}
                  onChange={handleChange}
                  placeholder="Who will play the sales rep?"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
                  required
                />
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Client/Prospect Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Client Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="client_name"
                  value={formData.client_name}
                  onChange={handleChange}
                  placeholder="Name of the prospect to roleplay"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="client_company"
                  value={formData.client_company}
                  onChange={handleChange}
                  placeholder="Client's company name"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Designation/Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="client_designation"
                  value={formData.client_designation}
                  onChange={handleChange}
                  placeholder="e.g., VP of Sales, CTO, Director of Marketing"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  About the Company <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="company_description"
                  value={formData.company_description}
                  onChange={handleChange}
                  placeholder="Brief description of the company, industry, size, challenges..."
                  rows={3}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none resize-none"
                  required
                />
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Call Objectives</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Call Objective <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="call_objective"
                  value={formData.call_objective}
                  onChange={handleChange}
                  placeholder="What is the goal of this call? e.g., Understand pain points, qualify lead, schedule demo..."
                  rows={2}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Call to Action (CTA) <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="call_cta"
                  value={formData.call_cta}
                  onChange={handleChange}
                  placeholder="What specific action do you want the prospect to take? e.g., Book a demo, agree to trial, schedule follow-up..."
                  rows={2}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none resize-none"
                  required
                />
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-6 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 text-slate-600 hover:text-slate-900 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg transition-colors"
            >
              Create Room
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
