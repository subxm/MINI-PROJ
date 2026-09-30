import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Database, FolderOpen, PlusCircle, Sparkles, ArrowRight, ShieldCheck, FileText } from 'lucide-react';

export default function Dashboard({ healthInfo, demoCases }) {
  const navigate = useNavigate();

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Header Banner */}
      <div className="dev-panel" style={{ padding: '1.75rem' }}>
        <div style={{ maxWidth: '720px' }}>
          <div className="badge badge-demo" style={{ marginBottom: '0.75rem' }}>
            <Sparkles size={12} />
            NLP Incident Similarity & Lead Intelligence
          </div>
          
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
            KAVACH Case Intelligence Workstation
          </h1>
          
          <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', marginBottom: '1.25rem', lineHeight: 1.6 }}>
            Cross-evaluate 10,000+ public SFPD historical records using hybrid TF-IDF text similarity, extract target entities, and generate actionable evidence lead checklists for new crime cases.
          </p>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link to="/cases/new" className="btn-primary">
              <PlusCircle size={17} />
              Record New Demo Case
            </Link>
            <Link to="/cases" className="btn-secondary">
              <FolderOpen size={17} />
              Demo Cases ({demoCases.length})
            </Link>
            <Link to="/historical" className="btn-secondary">
              <Database size={17} />
              SFPD Records ({healthInfo?.historical_records_count || 10000})
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
        
        <div className="dev-panel" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: '#21262d', color: '#38bdf8', padding: '0.85rem', borderRadius: '8px' }}>
            <Database size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>HISTORICAL SFPD RECORDS</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f0f6fc' }}>
              {healthInfo?.historical_records_count || 10000}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#38bdf8' }}>Public Dataset Sample</div>
          </div>
        </div>

        <div className="dev-panel" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: '#21262d', color: '#a5b4fc', padding: '0.85rem', borderRadius: '8px' }}>
            <FolderOpen size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>DEMO CASES CREATED</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f0f6fc' }}>
              {demoCases.length}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#a5b4fc' }}>Active User Submissions</div>
          </div>
        </div>

        <div className="dev-panel" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: '#21262d', color: '#34d399', padding: '0.85rem', borderRadius: '8px' }}>
            <ShieldCheck size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>DATABASE BACKEND</div>
            <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#34d399', marginTop: '0.1rem' }}>
              {healthInfo?.database_backend || 'Supabase PostgreSQL'}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Status: Active & Synchronized</div>
          </div>
        </div>

      </div>

      {/* Feature Spotlight */}
      <div className="dev-panel" style={{ padding: '1.5rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FileText size={18} color="var(--primary)" />
          How KAVACH Assists Investigation Analysis
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '1rem' }}>
          
          <div style={{ background: '#0d1117', padding: '1rem', borderRadius: '8px', border: '1px solid #21262d' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#a5b4fc', marginBottom: '0.25rem' }}>1. NARRATIVE VECTOR RETRIEVAL</div>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
              Computes TF-IDF vector similarity over 10,000+ public SFPD incident records to highlight matching MO narratives instantly.
            </p>
          </div>

          <div style={{ background: '#0d1117', padding: '1rem', borderRadius: '8px', border: '1px solid #21262d' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#38bdf8', marginBottom: '0.25rem' }}>2. ENTITY & MO MATRIX</div>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
              Extracts target property (laptops, watches, cash), entry methods (rear window forced), and neighborhood clusters.
            </p>
          </div>

          <div style={{ background: '#0d1117', padding: '1rem', borderRadius: '8px', border: '1px solid #21262d' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#34d399', marginBottom: '0.25rem' }}>3. ACTIONABLE LEAD CHECKLIST</div>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
              Generates an interactive investigator protocol checklist: CCTV canvassing, pawn shop alerts, and forensic inspection.
            </p>
          </div>

          <div style={{ background: '#0d1117', padding: '1rem', borderRadius: '8px', border: '1px solid #21262d' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fbbf24', marginBottom: '0.25rem' }}>4. PRINTABLE CASE DOSSIER</div>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
              1-click export of formal Case Analysis Briefings for presentation slides and senior officer reports.
            </p>
          </div>

        </div>
      </div>

      {/* Recent User Demo Cases */}
      <div className="dev-panel" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Recent User Demo Cases</h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Select a case to inspect actionable lead briefing and similar historical records</p>
          </div>
          <Link to="/cases" className="btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}>
            View All ({demoCases.length})
          </Link>
        </div>

        {demoCases.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)' }}>
            <p>No demo cases recorded yet.</p>
            <Link to="/cases/new" className="btn-primary" style={{ marginTop: '0.75rem' }}>
              Create First Demo Case
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {demoCases.slice(0, 4).map(c => (
              <Link key={c.id} to={`/cases/${c.id}`} className="dev-card-interactive">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                      <span className="badge badge-demo">DEMO USER</span>
                      <h3 style={{ fontSize: '0.975rem', fontWeight: 700, color: '#f0f6fc' }}>{c.title}</h3>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {c.incident_description}
                    </p>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className="badge badge-reason">{c.crime_category}</span>
                    <span className="btn-primary" style={{ padding: '0.35rem 0.7rem', fontSize: '0.8rem' }}>
                      Open Lead Briefing <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
