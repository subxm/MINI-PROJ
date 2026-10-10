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
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>My Cases</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Recorded incident cases evaluated against SFPD historical records</p>
        </div>

        <Link to="/cases/new" className="btn-primary">
          <PlusCircle size={17} />
          Record New Case
        </Link>
      </div>

      {/* Filter bar */}
      <div className="ui-card" style={{ padding: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: 1, minWidth: '220px', position: 'relative' }}>
          <Search size={17} color="var(--text-dim)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '2.5rem' }}
            placeholder="Search cases by title or keyword..."
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
        <div className="ui-card" style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          <FolderOpen size={36} style={{ color: 'var(--text-dim)', marginBottom: '0.75rem' }} />
          <h3 style={{ fontSize: '1.1rem' }}>No cases found</h3>
          <p style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>Try adjusting your search query or record a new case.</p>
          <Link to="/cases/new" className="btn-primary" style={{ marginTop: '1.25rem', padding: '0.55rem 1.1rem', fontSize: '0.875rem' }}>
            <PlusCircle size={15} /> Create New Case
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
          {filteredCases.map(c => (
            <Link key={c.id} to={`/cases/${c.id}`} className="ui-card-interactive" style={{ padding: '1.15rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                  <span className="badge badge-historical" style={{ fontSize: '0.7rem' }}>CASE LOG</span>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', fontFamily: 'var(--font-mono)' }}>
                    {c.created_at ? new Date(c.created_at).toLocaleDateString() : 'Recent'}
                  </span>
                </div>

                <h3 style={{ fontSize: '0.975rem', fontWeight: 700, marginBottom: '0.4rem', color: '#f8fafc', lineHeight: 1.35 }}>
                  {c.title}
                </h3>

                <p style={{
                  fontSize: '0.825rem',
                  color: '#94a3b8',
                  marginBottom: '0.85rem',
                  lineHeight: 1.5,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {c.incident_description}
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '0.85rem' }}>
                  <span className="badge badge-reason" style={{ fontSize: '0.75rem' }}>
                    <Tag size={11} /> {c.crime_category}
                  </span>
                  {c.neighborhood && (
                    <span className="badge badge-reason" style={{ background: 'rgba(16, 185, 129, 0.12)', color: '#34d399', fontSize: '0.75rem' }}>
                      <MapPin size={11} /> {c.neighborhood}
                    </span>
                  )}
                </div>
              </div>

              <div style={{ borderTop: '1px solid #1e293b', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.725rem', color: '#64748b', fontFamily: 'var(--font-mono)' }}>
                  #{c.id.substring(0, 8)}
                </span>
                
                <span className="btn-primary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.775rem' }}>
                  View Dossier <ArrowRight size={13} />
                </span>
              </div>

            </Link>
          ))}
        </div>
      )}

    </div>
  );
}
