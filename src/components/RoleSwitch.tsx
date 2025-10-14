import { ChevronDown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../lib/supabase';
import { useState, useRef, useEffect } from 'react';

export function RoleSwitch() {
  const { currentRole, switchRole } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const roles: { value: UserRole; label: string }[] = [
    { value: 'sales_rep', label: 'Sales Rep' },
    { value: 'manager', label: 'Manager' },
    { value: 'admin', label: 'Admin' },
  ];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentRoleLabel = roles.find(r => r.value === currentRole)?.label;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-slate-200 rounded-lg hover:bg-slate-600 transition-colors"
      >
        <span className="text-sm font-medium">{currentRoleLabel}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-50">
          {roles.map((role) => (
            <button
              key={role.value}
              onClick={() => {
                switchRole(role.value);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 transition-colors ${
                currentRole === role.value ? 'bg-slate-100 font-medium text-slate-900' : 'text-slate-700'
              }`}
            >
              {role.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
