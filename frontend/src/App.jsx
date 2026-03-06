import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, FileUp, FileText, Lightbulb, Home as HomeIcon, Target } from 'lucide-react';
import './styles/glass-ui.css';

import Home from './pages/Home';
import UploadPage from './pages/Upload';
import DashboardPage from './pages/Dashboard';
import ReportsPage from './pages/Reports';
import ProposalsPage from './pages/Proposals';
import StrategiesPage from './pages/Strategies';
import FloatingChat from './components/FloatingChat';

// Sidebar Navigation
const Sidebar = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path ? 'var(--primary)' : 'rgba(255,255,255,0.05)';

  return (
    <div className="glass-panel" style={{ width: '260px', borderRadius: '0 16px 16px 0', borderLeft: 'none', display: 'flex', flexDirection: 'column', padding: '24px 0' }}>
      <div style={{ padding: '0 24px', marginBottom: '2rem' }}>
        <h2 style={{ color: 'var(--primary)', fontWeight: 700, letterSpacing: '1px' }}>IQ<span style={{ color: '#fff' }}>Lenz</span></h2>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '0 16px' }}>
        <Link to="/" className="btn btn-glass" style={{ justifyContent: 'flex-start', background: isActive('/') }}><HomeIcon size={18} /><span>Home</span></Link>
        <Link to="/upload" className="btn btn-glass" style={{ justifyContent: 'flex-start', background: isActive('/upload') }}><FileUp size={18} /><span>Upload</span></Link>
        <Link to="/dashboard" className="btn btn-glass" style={{ justifyContent: 'flex-start', background: isActive('/dashboard') }}><LayoutDashboard size={18} /><span>Dashboard</span></Link>
        <Link to="/reports" className="btn btn-glass" style={{ justifyContent: 'flex-start', background: isActive('/reports') }}><FileText size={18} /><span>Reports</span></Link>
        <Link to="/proposals" className="btn btn-glass" style={{ justifyContent: 'flex-start', background: isActive('/proposals') }}><Lightbulb size={18} /><span>Proposals</span></Link>
        <Link to="/strategies" className="btn btn-glass" style={{ justifyContent: 'flex-start', background: isActive('/strategies') }}><Target size={18} /><span>Strategies</span></Link>
      </nav>
    </div>
  );
};

function App() {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <main className="main-content">
          <FloatingChat />
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/upload" element={<UploadPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/proposals" element={<ProposalsPage />} />
              <Route path="/strategies" element={<StrategiesPage />} />
            </Routes>
          </AnimatePresence>
        </main>
      </div>
    </Router>
  );
}

export default App;
