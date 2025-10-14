import { createContext, useContext, useState, ReactNode } from 'react';
import { User, UserRole } from '../lib/supabase';

interface AuthContextType {
  currentUser: User | null;
  currentRole: UserRole;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentRole, setCurrentRole] = useState<UserRole>('sales_rep');

  const demoUser: User = {
    id: '1',
    email: 'demo@effysales.com',
    full_name: 'Demo User',
    role: 'admin',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const switchRole = (role: UserRole) => {
    setCurrentRole(role);
  };

  return (
    <AuthContext.Provider value={{ currentUser: demoUser, currentRole, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
