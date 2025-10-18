import { Shield, Users, Database, Activity, Settings as SettingsIcon } from 'lucide-react';

export function AdminView() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-gradient-to-br from-red-500 to-pink-500 rounded-lg">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-100">Admin Dashboard</h1>
        </div>
        <p className="text-slate-400">Manage users, monitor system health, and configure platform settings</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-500/10 rounded-lg">
              <Users className="w-6 h-6 text-blue-400" />
            </div>
            <span className="text-xs font-medium text-slate-500 uppercase">Total Users</span>
          </div>
          <div className="text-3xl font-bold text-slate-100 mb-1">1,247</div>
          <div className="text-sm text-green-400">+12% from last month</div>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-cyan-500/10 rounded-lg">
              <Activity className="w-6 h-6 text-cyan-400" />
            </div>
            <span className="text-xs font-medium text-slate-500 uppercase">Active Sessions</span>
          </div>
          <div className="text-3xl font-bold text-slate-100 mb-1">89</div>
          <div className="text-sm text-slate-400">Live now</div>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-500/10 rounded-lg">
              <Database className="w-6 h-6 text-purple-400" />
            </div>
            <span className="text-xs font-medium text-slate-500 uppercase">Storage Used</span>
          </div>
          <div className="text-3xl font-bold text-slate-100 mb-1">4.2 GB</div>
          <div className="text-sm text-slate-400">of 8 GB (52%)</div>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-500/10 rounded-lg">
              <SettingsIcon className="w-6 h-6 text-green-400" />
            </div>
            <span className="text-xs font-medium text-slate-500 uppercase">System Health</span>
          </div>
          <div className="text-3xl font-bold text-slate-100 mb-1">99.8%</div>
          <div className="text-sm text-green-400">All systems operational</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <h2 className="text-xl font-bold text-slate-100 mb-4">User Management</h2>
          <div className="space-y-3">
            <button className="w-full text-left px-4 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors">
              <div className="font-medium text-slate-100">View All Users</div>
              <div className="text-sm text-slate-400">Browse and manage user accounts</div>
            </button>
            <button className="w-full text-left px-4 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors">
              <div className="font-medium text-slate-100">Role Assignments</div>
              <div className="text-sm text-slate-400">Manage user roles and permissions</div>
            </button>
            <button className="w-full text-left px-4 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors">
              <div className="font-medium text-slate-100">Team Management</div>
              <div className="text-sm text-slate-400">Create and manage teams</div>
            </button>
          </div>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <h2 className="text-xl font-bold text-slate-100 mb-4">System Configuration</h2>
          <div className="space-y-3">
            <button className="w-full text-left px-4 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors">
              <div className="font-medium text-slate-100">Platform Settings</div>
              <div className="text-sm text-slate-400">Configure global platform settings</div>
            </button>
            <button className="w-full text-left px-4 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors">
              <div className="font-medium text-slate-100">Integration Settings</div>
              <div className="text-sm text-slate-400">Manage third-party integrations</div>
            </button>
            <button className="w-full text-left px-4 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors">
              <div className="font-medium text-slate-100">Audit Logs</div>
              <div className="text-sm text-slate-400">View system activity and changes</div>
            </button>
          </div>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <h2 className="text-xl font-bold text-slate-100 mb-4">Recent Activity</h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3 pb-3 border-b border-slate-700">
              <div className="w-2 h-2 rounded-full bg-green-400 mt-2"></div>
              <div className="flex-1">
                <div className="text-sm text-slate-300">New user registered: john.doe@company.com</div>
                <div className="text-xs text-slate-500 mt-1">2 minutes ago</div>
              </div>
            </div>
            <div className="flex items-start gap-3 pb-3 border-b border-slate-700">
              <div className="w-2 h-2 rounded-full bg-blue-400 mt-2"></div>
              <div className="flex-1">
                <div className="text-sm text-slate-300">AI Provider settings updated</div>
                <div className="text-xs text-slate-500 mt-1">15 minutes ago</div>
              </div>
            </div>
            <div className="flex items-start gap-3 pb-3 border-b border-slate-700">
              <div className="w-2 h-2 rounded-full bg-purple-400 mt-2"></div>
              <div className="flex-1">
                <div className="text-sm text-slate-300">New bot created: "Tech Support Agent"</div>
                <div className="text-xs text-slate-500 mt-1">1 hour ago</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-cyan-400 mt-2"></div>
              <div className="flex-1">
                <div className="text-sm text-slate-300">Database backup completed successfully</div>
                <div className="text-xs text-slate-500 mt-1">3 hours ago</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <h2 className="text-xl font-bold text-slate-100 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button className="w-full px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-medium rounded-lg transition-all">
              Create New User
            </button>
            <button className="w-full px-4 py-3 bg-slate-700 hover:bg-slate-600 text-slate-100 font-medium rounded-lg transition-colors">
              Export User Data
            </button>
            <button className="w-full px-4 py-3 bg-slate-700 hover:bg-slate-600 text-slate-100 font-medium rounded-lg transition-colors">
              Generate System Report
            </button>
            <button className="w-full px-4 py-3 bg-slate-700 hover:bg-slate-600 text-slate-100 font-medium rounded-lg transition-colors">
              View Analytics Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
