import { useEffect, useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { initializeStore } from './store';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Players from './pages/Players';
import Positions from './pages/Positions';
import VirtualField from './pages/VirtualField';
import Draw from './pages/Draw';
import Payments from './pages/Payments';
import Goals from './pages/Goals';
import Assists from './pages/Assists';
import Matches from './pages/Matches';
import Settings from './pages/Settings';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isLoggedIn = sessionStorage.getItem('ufc_logged_in') === 'true';
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(sessionStorage.getItem('ufc_logged_in') === 'true');

  useEffect(() => {
    initializeStore();
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('ufc_logged_in');
    setIsLoggedIn(false);
  };

  return (
    <HashRouter>
      <Routes>
        {/* Rota pública - Home */}
        <Route path="/" element={<Home />} />
        
        {/* Login */}
        <Route path="/login" element={
          isLoggedIn ? <Navigate to="/admin" replace /> : <Login />
        } />
        
        {/* Área Administrativa */}
        <Route path="/admin" element={
          <ProtectedRoute>
            <Layout onLogout={handleLogout}>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/admin/players" element={
          <ProtectedRoute>
            <Layout onLogout={handleLogout}>
              <Players />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/admin/positions" element={
          <ProtectedRoute>
            <Layout onLogout={handleLogout}>
              <Positions />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/admin/virtual-field" element={
          <ProtectedRoute>
            <Layout onLogout={handleLogout}>
              <VirtualField />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/admin/draw" element={
          <ProtectedRoute>
            <Layout onLogout={handleLogout}>
              <Draw />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/admin/payments" element={
          <ProtectedRoute>
            <Layout onLogout={handleLogout}>
              <Payments />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/admin/goals" element={
          <ProtectedRoute>
            <Layout onLogout={handleLogout}>
              <Goals />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/admin/assists" element={
          <ProtectedRoute>
            <Layout onLogout={handleLogout}>
              <Assists />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/admin/matches" element={
          <ProtectedRoute>
            <Layout onLogout={handleLogout}>
              <Matches />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/admin/settings" element={
          <ProtectedRoute>
            <Layout onLogout={handleLogout}>
              <Settings />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
