import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { UIProvider } from './context/UIContext';
import { WalletProvider } from './context/WalletContext';
import { CopyTradeProvider } from './context/CopyTradeContext';
import { SimulationProvider } from './context/SimulationContext';

// Pages
import Login from './pages/auth/Login';
import Dashboard from './pages/dashboard/Dashboard';
import Wallets from './pages/wallets/Wallets';
import WalletDetail from './pages/wallets/WalletDetail';
import CopyTrade from './pages/copyTrade/CopyTrade';
import CopyTradeDetail from './pages/copyTrade/CopyTradeDetail';
import Simulation from './pages/simulation/Simulation';
import SimulationDetail from './pages/simulation/SimulationDetail';
import Analytics from './pages/analytics/Analytics';
import Admin from './pages/admin/Admin';
import Settings from './pages/settings/Settings';

// Components
import ProtectedRoute from './components/common/ProtectedRoute';
import AdminRoute from './components/common/AdminRoute';
import Layout from './components/layout/Layout';

// Utilities
import { useAuth } from './hooks/useAuth';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <UIProvider>
          <WalletProvider>
            <CopyTradeProvider>
              <SimulationProvider>
                <AppContent />
                <ToastContainer position="top-right" />
              </SimulationProvider>
            </CopyTradeProvider>
          </WalletProvider>
        </UIProvider>
      </AuthProvider>
    </Router>
  );
};

const AppContent = () => {
  const { isAuthenticated, loading, checkAuth } = useAuth();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
      
      <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/wallets" element={<Wallets />} />
          <Route path="/wallets/:id" element={<WalletDetail />} />
          <Route path="/copy-trade" element={<CopyTrade />} />
          <Route path="/copy-trade/:id" element={<CopyTradeDetail />} />
          <Route path="/simulation" element={<Simulation />} />
          <Route path="/simulation/:id" element={<SimulationDetail />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<Settings />} />
          
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<Admin />} />
          </Route>
        </Route>
      </Route>
      
      <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
    </Routes>
  );
};

export default App;