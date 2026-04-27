
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/Login';
import { SignupPage } from './pages/Signup';
import { KeeperDashboard } from './pages/KeeperDashboard';
import { OwnerDashboard } from './pages/OwnerDashboard';
import { storage } from './lib/storage';
import { Role } from './lib/types';

function App() {
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedRole = storage.getRole();
    if (savedRole) {
      setRole(savedRole);
    }
    setLoading(false);
  }, []);

  const handleLogin = (newRole: Role) => {
    setRole(newRole);
  };

  const handleLogout = () => {
    storage.setRole(null);
    setRole(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={
            role === 'Owner' ? (
              <Navigate to="/owner" replace />
            ) : role === 'Shopkeeper' ? (
              <Navigate to="/keeper" replace />
            ) : (
              <LoginPage onLogin={handleLogin} />
            )
          } 
        />
        <Route path="/signup" element={<SignupPage />} />
        <Route 
          path="/keeper" 
          element={
            role === 'Shopkeeper' ? (
              <KeeperDashboard onLogout={handleLogout} />
            ) : (
              <Navigate to="/" replace />
            )
          } 
        />
        <Route 
          path="/owner" 
          element={
            role === 'Owner' ? (
              <OwnerDashboard onLogout={handleLogout} />
            ) : (
              <Navigate to="/" replace />
            )
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
