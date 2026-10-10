import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingHeader from './components/LandingHeader';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import CaseList from './pages/CaseList';
import NewCase from './pages/NewCase';
import CaseDetail from './pages/CaseDetail';
import HistoricalExplorer from './pages/HistoricalExplorer';
import { fetchHealth, fetchDemoCases } from './services/api';

function HeaderSelector() {
  const location = useLocation();
  if (location.pathname === '/') {
    return <LandingHeader />;
  }
  return <Navbar />;
}

function FooterSelector() {
  const location = useLocation();
  if (location.pathname !== '/') return null;
  return (
    <footer style={{
      borderTop: '1px solid var(--border-color)',
      padding: '1.5rem',
      textAlign: 'center',
      fontSize: '0.8rem',
      color: 'var(--text-dim)',
      background: '#1e293b'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <strong>KAVACH</strong> — Incident Similarity & Investigation Support System
        </div>
        <div>
          <a
            href="https://github.com/subxm/MINI-PROJ"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#38bdf8', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontWeight: 500 }}
          >
            GitHub Repository
          </a>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  const [healthInfo, setHealthInfo] = useState(null);
  const [demoCases, setDemoCases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [h, c] = await Promise.all([
        fetchHealth().catch(() => null),
        fetchDemoCases().catch(() => [])
      ]);
      setHealthInfo(h);
      setDemoCases(c);
    } catch (err) {
      console.error("Failed to load initial application data:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <BrowserRouter>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        
        {/* Dynamic Header: LandingHeader for / and Navbar for Workstation pages */}
        <HeaderSelector />

        {/* Multi-Page Route Outlet */}
        <main style={{ flex: 1, maxWidth: '1200px', width: '100%', margin: '0 auto', padding: '2rem 1.5rem' }}>
          
          <Routes>
            <Route
              path="/"
              element={<LandingPage healthInfo={healthInfo} />}
            />

            <Route
              path="/dashboard"
              element={<Dashboard healthInfo={healthInfo} demoCases={demoCases} />}
            />
            
            <Route
              path="/cases"
              element={<CaseList demoCases={demoCases} />}
            />
            
            <Route
              path="/cases/new"
              element={<NewCase onCaseCreated={loadInitialData} />}
            />
            
            <Route
              path="/cases/:id"
              element={<CaseDetail />}
            />
            
            <Route
              path="/historical"
              element={<HistoricalExplorer healthInfo={healthInfo} onRefreshHealth={loadInitialData} />}
            />
          </Routes>

        </main>

        {/* Footer rendered strictly on Landing Page (/) */}
        <FooterSelector />

      </div>
    </BrowserRouter>
  );
}
