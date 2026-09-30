import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FolderOpen, PlusCircle, Search, ArrowRight, MapPin, Tag } from 'lucide-react';

export default function CaseList({ demoCases }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const filteredCases = demoCases.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.incident_description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || c.crime_category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = ['All', ...new Set(demoCases.map(c => c.crime_category).filter(Boolean))];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Demo Cases</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Recorded demo cases evaluated against SFPD historical records</p>
        </div>

        <Link to="/cases/new" className="btn-primary">
          <PlusCircle size={17} />
          Record New Demo Case
        </Link>
      </div>

      {/* Filter bar */}
      <div className="dev-panel" style={{ padding: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: 1, minWidth: '220px', position: 'relative' }}>
          <Search size={17} color="var(--text-dim)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '2.5rem' }}
            placeholder="Search demo cases by title or keyword..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        <div style={{ width: '200px' }}>
          <select
            className="form-select"
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat === 'All' ? 'All Categories' : cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Case Grid */}
      {filteredCases.length === 0 ? (
        <div className="dev-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          <FolderOpen size={40} style={{ color: 'var(--text-dim)', marginBottom: '0.75rem' }} />
          <h3>No demo cases found</h3>
          <p style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>Try adjusting your search query or record a new demo case.</p>
          <Link to="/cases/new" className="btn-primary" style={{ marginTop: '1.25rem' }}>
            <PlusCircle size={16} /> Create Demo Case
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.25rem' }}>
          {filteredCases.map(c => (
            <Link key={c.id} to={`/cases/${c.id}`} className="dev-card-interactive" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span className="badge badge-demo">DEMO USER</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                    {c.created_at ? new Date(c.created_at).toLocaleDateString() : 'Recent'}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.5rem', color: '#f0f6fc' }}>
                  {c.title}
                </h3>

                <p style={{
                  fontSize: '0.875rem',
                  color: 'var(--text-muted)',
                  marginBottom: '1rem',
                  lineHeight: 1.5,
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {c.incident_description}
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1rem' }}>
                  <span className="badge badge-reason">
                    <Tag size={12} /> {c.crime_category}
                  </span>
                  {c.crime_subcategory && (
                    <span className="badge badge-reason" style={{ background: 'rgba(56, 189, 248, 0.12)', color: '#38bdf8' }}>
                      {c.crime_subcategory}
                    </span>
                  )}
                  {c.neighborhood && (
                    <span className="badge badge-reason" style={{ background: 'rgba(16, 185, 129, 0.12)', color: '#34d399' }}>
                      <MapPin size={12} /> {c.neighborhood}
                    </span>
                  )}
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--bg-card-border)', paddingTop: '0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                  ID: {c.id.substring(0, 8)}...
                </span>
                
                <span className="btn-primary" style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}>
                  Open Lead Briefing <ArrowRight size={14} />
                </span>
              </div>

            </Link>
          ))}
        </div>
      )}

    </div>
  );
}
