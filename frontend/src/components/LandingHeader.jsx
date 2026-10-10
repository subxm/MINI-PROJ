import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowRight } from 'lucide-react';

export default function LandingHeader() {
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
        padding: '0.85rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Brand */}
        <Link to="/" style={{ textDecoration: 'none' }}>
          <div style={{ fontWeight: 800, fontSize: '1.25rem', color: '#f8fafc', letterSpacing: '-0.02em', fontFamily: 'var(--font-display)' }}>
            KAVACH
          </div>
        </Link>

        {/* Top-Right Launch Button */}
        <Link to="/dashboard" className="btn-primary" style={{ padding: '0.55rem 1.25rem', fontSize: '0.875rem' }}>
          Launch Workstation <ArrowRight size={16} />
        </Link>

      </div>
    </header>
  );
}
