import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface CreateRoomModalProps {
  onClose: () => void;
  onCreateRoom: (roomData: RoomFormData) => void;
  initialData?: Partial<RoomFormData>;
  isEditing?: boolean;
}

export interface RoomFormData {
  name: string;
  rep_name: string;
  rep_type: 'employee' | 'external';
  rep_employee_id?: string;
  client_name: string;
  client_type: 'employee' | 'external';
  client_employee_id?: string;
  client_company: string;
  client_designation: string;
  company_description: string;
  call_objective: string;
  call_cta: string;
  allow_external: boolean;
}

interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
}

export function CreateRoomModal({ onClose, onCreateRoom, initialData, isEditing = false }: CreateRoomModalProps) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [allowExternal, setAllowExternal] = useState(false);
  const [formData, setFormData] = useState<RoomFormData>({
    name: initialData?.name || '',
    rep_name: initialData?.rep_name || '',
    rep_type: initialData?.rep_type || 'employee',
    client_name: initialData?.client_name || '',
    client_type: initialData?.client_type || 'employee',
    client_company: initialData?.client_company || '',
    client_designation: initialData?.client_designation || '',
    company_description: initialData?.company_description || '',
    call_objective: initialData?.call_objective || '',
    call_cta: initialData?.call_cta || '',
    allow_external: initialData?.allow_external || false,
  });

  useEffect(() => {
    fetchEmployees();
    checkExternalAllowed();
  }, []);

  async function fetchEmployees() {
    const { data } = await supabase
      .from('employees')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (data) {
      setEmployees(data);
    }
  }

  async function checkExternalAllowed() {
    const { data } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'allow_external_invites')
      .maybeSingle();

    if (data?.value && typeof data.value === 'object' && 'enabled' in data.value) {
      setAllowExternal(data.value.enabled as boolean);
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const hasExternal = formData.rep_type === 'external' || formData.client_type === 'external';
    onCreateRoom({ ...formData, allow_external: hasExternal });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleRepTypeChange = (type: 'employee' | 'external') => {
    setFormData({
      ...formData,
      rep_type: type,
      rep_name: '',
      rep_employee_id: undefined,
    });
  };

  const handleClientTypeChange = (type: 'employee' | 'external') => {
    setFormData({
      ...formData,
      client_type: type,
      client_name: '',
      client_employee_id: undefined,
    });
  };

  const handleEmployeeSelect = (field: 'rep' | 'client', employeeId: string) => {
    const employee = employees.find((e) => e.id === employeeId);
    if (employee) {
      if (field === 'rep') {
        setFormData({
          ...formData,
          rep_employee_id: employeeId,
          rep_name: employee.name,
        });
      } else {
        setFormData({
          ...formData,
          client_employee_id: employeeId,
          client_name: employee.name,
          client_designation: employee.role,
        });
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">{isEditing ? 'Edit Practice Room' : 'Create Practice Room'}</h2>
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
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Participants</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <label className="block text-sm font-medium text-slate-700">
                  Sales Rep <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleRepTypeChange('employee')}
                    className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      formData.rep_type === 'employee'
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Employee
                  </button>
                  {allowExternal && (
                    <button
                      type="button"
                      onClick={() => handleRepTypeChange('external')}
                      className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        formData.rep_type === 'external'
                          ? 'bg-slate-900 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      External
                    </button>
                  )}
                </div>
                {formData.rep_type === 'employee' ? (
                  <select
                    onChange={(e) => handleEmployeeSelect('rep', e.target.value)}
                    value={formData.rep_employee_id || ''}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
                    required
                  >
                    <option value="">Select employee...</option>
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.name} - {emp.role}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    name="rep_name"
                    value={formData.rep_name}
                    onChange={handleChange}
                    placeholder="External rep name"
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
                    required
                  />
                )}
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-medium text-slate-700">
                  Client/Prospect <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleClientTypeChange('employee')}
                    className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      formData.client_type === 'employee'
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Employee
                  </button>
                  {allowExternal && (
                    <button
                      type="button"
                      onClick={() => handleClientTypeChange('external')}
                      className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        formData.client_type === 'external'
                          ? 'bg-slate-900 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      External
                    </button>
                  )}
                </div>
                {formData.client_type === 'employee' ? (
                  <select
                    onChange={(e) => handleEmployeeSelect('client', e.target.value)}
                    value={formData.client_employee_id || ''}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
                    required
                  >
                    <option value="">Select employee...</option>
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.name} - {emp.role}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    name="client_name"
                    value={formData.client_name}
                    onChange={handleChange}
                    placeholder="External client name"
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
                    required
                  />
                )}
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Client Information</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Company Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="client_company"
                    value={formData.client_company}
                    onChange={handleChange}
                    placeholder="Client's company"
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Designation <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="client_designation"
                    value={formData.client_designation}
                    onChange={handleChange}
                    placeholder="e.g., VP of Sales"
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
                    required
                    disabled={formData.client_type === 'employee'}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  About the Company <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="company_description"
                  value={formData.company_description}
                  onChange={handleChange}
                  placeholder="Industry, size, challenges, current situation..."
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
                  placeholder="What should be accomplished in this call?"
                  rows={2}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Call to Action <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="call_cta"
                  value={formData.call_cta}
                  onChange={handleChange}
                  placeholder="Desired next step or commitment from prospect"
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
              {isEditing ? 'Update Room' : 'Create Room'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
