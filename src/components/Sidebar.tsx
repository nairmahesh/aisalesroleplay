import { LayoutDashboard, Users, MessageSquare, FileText, Settings, ChevronDown, ChevronRight, Bot, UsersRound, Cpu, Shield, DollarSign } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

export function Sidebar({ activeView, onViewChange }: SidebarProps) {
  const { currentRole } = useAuth();
  const [isPitchPracticeOpen, setIsPitchPracticeOpen] = useState(true);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['sales_rep', 'manager', 'admin'] },
    { id: 'history', label: 'Call History', icon: FileText, roles: ['sales_rep', 'manager', 'admin'] },
    { id: 'manage-bots', label: 'Manage Bots', icon: Users, roles: ['manager', 'admin'] },
    { id: 'admin', label: 'Admin', icon: Shield, roles: ['admin'] },
    { id: 'pricing', label: 'Pricing Analysis', icon: DollarSign, roles: ['admin'] },
    { id: 'ai-settings', label: 'AI Providers', icon: Cpu, roles: ['admin'] },
    { id: 'settings', label: 'Settings', icon: Settings, roles: ['admin'] },
  ];

  const pitchPracticeSubmenu = [
    { id: 'ai-roleplay', label: 'AI Role Play', icon: Bot },
    { id: 'human-roleplay', label: 'Human to Human', icon: UsersRound },
  ];

  const visibleItems = menuItems.filter(item => item.roles.includes(currentRole));

  const isPitchPracticeActive = ['ai-roleplay', 'human-roleplay'].includes(activeView);

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 min-h-[calc(100vh-73px)]">
      <nav className="p-4 space-y-1">
        <div className="mb-6">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 mb-3">
            Menu
          </p>
        </div>

        <div>
          <button
            onClick={() => setIsPitchPracticeOpen(!isPitchPracticeOpen)}
            className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg transition-all ${
              isPitchPracticeActive
                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg'
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <MessageSquare className="w-5 h-5" />
              <span className="font-medium">Pitch Practice</span>
            </div>
            {isPitchPracticeOpen ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>

          {isPitchPracticeOpen && (
            <div className="ml-4 mt-1 space-y-1 border-l border-slate-700 pl-4">
              {pitchPracticeSubmenu.map((item) => {
                const Icon = item.icon;
                const isActive = activeView === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => onViewChange(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-sm ${
                      isActive
                        ? 'bg-slate-800 text-cyan-400'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {visibleItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
