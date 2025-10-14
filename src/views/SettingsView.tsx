import { Shield, Users, Bell, Database } from 'lucide-react';

export function SettingsView() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Settings</h1>
        <p className="text-slate-600">Manage platform configuration and permissions</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">User Management</h2>
          </div>
          <p className="text-slate-600 mb-4">Control user access and role assignments</p>
          <button className="w-full px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition-colors">
            Manage Users
          </button>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Permissions</h2>
          </div>
          <p className="text-slate-600 mb-4">Configure role-based access controls</p>
          <button className="w-full px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition-colors">
            Configure Roles
          </button>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
              <Bell className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Notifications</h2>
          </div>
          <p className="text-slate-600 mb-4">Manage email and system notifications</p>
          <button className="w-full px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition-colors">
            Notification Settings
          </button>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
              <Database className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Data Management</h2>
          </div>
          <p className="text-slate-600 mb-4">Export and backup platform data</p>
          <button className="w-full px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition-colors">
            Data Options
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Role Permissions</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700">Permission</th>
                <th className="text-center px-4 py-3 text-sm font-semibold text-slate-700">Sales Rep</th>
                <th className="text-center px-4 py-3 text-sm font-semibold text-slate-700">Manager</th>
                <th className="text-center px-4 py-3 text-sm font-semibold text-slate-700">Admin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {[
                { permission: 'Practice with Bots', rep: true, manager: true, admin: true },
                { permission: 'View Own Call History', rep: true, manager: true, admin: true },
                { permission: 'View Team Call History', rep: false, manager: true, admin: true },
                { permission: 'Create/Edit Bots', rep: false, manager: true, admin: true },
                { permission: 'Delete Bots', rep: false, manager: false, admin: true },
                { permission: 'User Management', rep: false, manager: false, admin: true },
                { permission: 'System Settings', rep: false, manager: false, admin: true },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-sm text-slate-700">{row.permission}</td>
                  <td className="px-4 py-3 text-center">
                    <div className={`inline-block w-3 h-3 rounded-full ${row.rep ? 'bg-green-500' : 'bg-slate-300'}`} />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className={`inline-block w-3 h-3 rounded-full ${row.manager ? 'bg-green-500' : 'bg-slate-300'}`} />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className={`inline-block w-3 h-3 rounded-full ${row.admin ? 'bg-green-500' : 'bg-slate-300'}`} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
