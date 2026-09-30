import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import CaseList from './pages/CaseList';
import NewCase from './pages/NewCase';
import CaseDetail from './pages/CaseDetail';
import HistoricalExplorer from './pages/HistoricalExplorer';
import { fetchHealth, fetchDemoCases } from './services/api';

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
        
        {/* Top Navbar */}
        <Navbar />

        {/* Multi-Page Route Outlet */}
        <main style={{ flex: 1, maxWidth: '1200px', width: '100%', margin: '0 auto', padding: '2rem 1.5rem' }}>
          
          <Routes>
            <Route
              path="/"
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

        {/* Footer */}
        <footer style={{
          borderTop: '1px solid var(--bg-card-border)',
          padding: '1.5rem',
          textAlign: 'center',
          fontSize: '0.8rem',
          color: 'var(--text-dim)',
          background: '#161b22'
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <strong>KAVACH</strong> — AI Incident Similarity & Actionable Lead Workstation
            </div>
            <div>
              Public SFPD Incident Dataset Demonstration
            </div>
          </div>
        </footer>

      </div>
    </BrowserRouter>
  );
}
