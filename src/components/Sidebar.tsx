import { LayoutDashboard, Users, MessageSquare, FileText, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

export function Sidebar({ activeView, onViewChange }: SidebarProps) {
  const { currentRole } = useAuth();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['sales_rep', 'manager', 'admin'] },
    { id: 'bots', label: 'Digital Sales Rooms', icon: MessageSquare, roles: ['sales_rep', 'manager', 'admin'] },
    { id: 'history', label: 'Call History', icon: FileText, roles: ['sales_rep', 'manager', 'admin'] },
    { id: 'manage-bots', label: 'Manage Bots', icon: Users, roles: ['manager', 'admin'] },
    { id: 'settings', label: 'Settings', icon: Settings, roles: ['admin'] },
  ];

  const visibleItems = menuItems.filter(item => item.roles.includes(currentRole));

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 min-h-[calc(100vh-73px)]">
      <nav className="p-4 space-y-1">
        <div className="mb-6">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 mb-3">
            Menu
          </p>
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
