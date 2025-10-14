import { Sparkles, Shield } from 'lucide-react';
import { RoleSwitch } from './RoleSwitch';
import { useAuth } from '../contexts/AuthContext';

export function Header() {
  const { currentUser } = useAuth();

  return (
    <header className="bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">effySales Pro</h1>
              <p className="text-xs text-slate-400">AI Sales Roleplay Platform</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 px-4 py-2 bg-slate-800 rounded-lg border border-slate-700">
              <Shield className="w-4 h-4 text-slate-400" />
              <div className="text-right">
                <p className="text-sm font-medium text-white">{currentUser?.full_name}</p>
                <p className="text-xs text-slate-400">{currentUser?.email}</p>
              </div>
            </div>
            <RoleSwitch />
          </div>
        </div>
      </div>
    </header>
  );
}
