import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Shield, LayoutDashboard, FolderOpen, PlusCircle, Database } from 'lucide-react';

export default function Navbar() {
  return (
    <header style={{
      borderBottom: '1px solid var(--border-color)',
      background: '#1e293b',
      position: 'sticky',
      top: 0,
      zIndex: 100
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
        <Link to="/dashboard" style={{ textDecoration: 'none' }}>
          <div style={{ fontWeight: 800, fontSize: '1.25rem', color: '#f8fafc', letterSpacing: '-0.02em', fontFamily: 'var(--font-display)' }}>
            KAVACH
          </div>
        </Link>

        {/* Workstation Navigation Tabs */}
        <nav style={{
          display: 'flex',
          gap: '0.25rem',
          background: '#0f172a',
          padding: '0.25rem',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border-color)'
        }}>
          <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <LayoutDashboard size={15} />
            <span>Dashboard</span>
          </NavLink>
          
          <NavLink to="/cases" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <FolderOpen size={15} />
            <span>My Cases</span>
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

        {/* Action Button */}
        <Link to="/cases/new" className="btn-primary" style={{ padding: '0.45rem 0.95rem', fontSize: '0.85rem' }}>
          <PlusCircle size={15} /> Record Incident
        </Link>

      </div>
    </header>
  );
}
