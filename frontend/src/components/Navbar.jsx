import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Shield, LayoutDashboard, FolderOpen, PlusCircle, Database, UserCheck } from 'lucide-react';

export default function Navbar() {
  return (
    <header style={{
      borderBottom: '1px solid var(--bg-card-border)',
      background: '#161b22',
      sticky: 'top',
      top: 0,
      zIndex: 100,
      position: 'sticky'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0.75rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        {/* Brand */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
          <div style={{
            background: 'var(--primary)',
            padding: '0.45rem',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid #4f46e5'
          }}>
            <Shield size={20} color="#fff" />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.15rem', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f0f6fc' }}>
              <span>KAVACH</span>
              <span className="badge badge-demo" style={{ fontSize: '0.65rem', padding: '0.15rem 0.45rem' }}>v1.0</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              AI Incident Similarity & Actionable Lead Workstation
            </div>
          </div>
        </Link>

        {/* Multi-Page Navigation Links */}
        <nav style={{ display: 'flex', gap: '0.25rem', background: '#0d1117', padding: '0.25rem', borderRadius: '8px', border: '1px solid #21262d' }}>
          <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <LayoutDashboard size={15} />
            <span>Dashboard</span>
          </NavLink>
          
          <NavLink to="/cases" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <FolderOpen size={15} />
            <span>Demo Cases</span>
          </NavLink>

          <NavLink to="/cases/new" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <PlusCircle size={15} />
            <span>New Case</span>
          </NavLink>

          <NavLink to="/historical" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <Database size={15} />
            <span>SFPD Dataset</span>
          </NavLink>
        </nav>

        {/* Investigator Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <UserCheck size={16} color="#10b981" />
          <span>Investigator Workstation</span>
        </div>

      </div>
    </header>
  );
}
