import { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './views/DashboardView';
import { AIRoleplayView } from './views/AIRoleplayView';
import { HumanToHumanView } from './views/HumanToHumanView';
import { CallHistoryView } from './views/CallHistoryView';
import { ManageBotsView } from './views/ManageBotsView';
import { SettingsView } from './views/SettingsView';

function App() {
  console.log('App component rendering');
  const [activeView, setActiveView] = useState('dashboard');

  const renderView = () => {
    try {
      console.log('Rendering view:', activeView);
      switch (activeView) {
        case 'dashboard':
          return <DashboardView />;
        case 'ai-roleplay':
          return <AIRoleplayView />;
        case 'human-roleplay':
          return <HumanToHumanView />;
        case 'history':
          return <CallHistoryView />;
        case 'manage-bots':
          return <ManageBotsView />;
        case 'settings':
          return <SettingsView />;
        default:
          return <DashboardView />;
      }
    } catch (error) {
      console.error('Error rendering view:', error);
      return <div style={{ padding: '32px', color: 'red', backgroundColor: 'white' }}>Error loading view. Check console.</div>;
    }
  };

  try {
    return (
      <AuthProvider>
        <div className="min-h-screen bg-slate-50">
          <Header />
          <div className="flex">
            <Sidebar activeView={activeView} onViewChange={setActiveView} />
            <main className="flex-1 p-8">
              {renderView()}
            </main>
          </div>
        </div>
      </AuthProvider>
    );
  } catch (error) {
    console.error('Error in App component:', error);
    return <div style={{ padding: '32px', color: 'red', backgroundColor: 'white' }}>Fatal error: {String(error)}</div>;
  }
}

export default App;
