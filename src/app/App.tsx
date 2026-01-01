import { useState } from 'react';
import { LoginPage } from './components/LoginPage';
import { MainLayout } from './components/MainLayout';
import { Toaster } from './components/ui/sonner';

// Mock user type
export type UserRole = 'ADMIN' | 'STAFF' | 'DJ' | 'PROMOTER' | 'EXTERNAL_EVENT';

export interface User {
  id: string;
  username: string;
  displayName: string;
  role: UserRole;
  clubId: string;
  clubName: string;
  clubSlug: string;
  startDate?: string;
  endDate?: string;
}

function App() {
  // Start with login page for demo
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = (username: string, password: string) => {
    // Mock login - in real app this would call Supabase
    // For demo, any login works
    const mockUser: User = {
      id: '1',
      username,
      displayName: username,
      role: username === 'admin' ? 'ADMIN' : username === 'staff' ? 'STAFF' : 'DJ',
      clubId: '1',
      clubName: 'Octagon Seoul',
      clubSlug: 'octagon'
    };
    setUser(mockUser);
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <>
      <MainLayout user={user} onLogout={handleLogout} />
      <Toaster />
    </>
  );
}

export default App;