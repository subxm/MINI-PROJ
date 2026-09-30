import React, { useState, useEffect } from 'react';
import { Database, Search, RefreshCw, ChevronLeft, ChevronRight, Tag, MapPin, Calendar, CheckCircle2 } from 'lucide-react';
import { fetchHistoricalCases, triggerImportSample } from '../services/api';

const CATEGORIES = [
  "All",
  "Burglary",
  "Larceny Theft",
  "Robbery",
  "Motor Vehicle Theft",
  "Vandalism",
  "Financial Crime",
  "Assault"
];

export default function HistoricalExplorer({ healthInfo, onRefreshHealth }) {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
  const [importMessage, setImportMessage] = useState(null);

  useEffect(() => {
    loadHistoricalRecords();
  }, [page, category]);

  const loadHistoricalRecords = async () => {
    try {
      setLoading(true);
      const res = await fetchHistoricalCases(query, category, page, limit);
      setItems(res.items);
      setTotal(res.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    loadHistoricalRecords();
  };

  const handleImportSample = async () => {
    try {
      setImporting(true);
      setImportMessage(null);
      const res = await triggerImportSample();
      setImportMessage(`Imported ${res.inserted_or_updated || 0} records from ${res.csv_path}`);
      if (onRefreshHealth) onRefreshHealth();
      setPage(1);
      loadHistoricalRecords();
    } catch (err) {
      setImportMessage(`Import error: ${err.message}`);
    } finally {
      setImporting(false);
    }
  };

  const totalPages = Math.ceil(total / limit) || 1;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Public SFPD Incident Records</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Historical dataset repository used for similarity vector matching
          </p>
        </div>

        <button
          className="btn-secondary"
          onClick={handleImportSample}
          disabled={importing}
          style={{ fontSize: '0.85rem' }}
        >
          <RefreshCw size={16} className={importing ? 'animate-spin' : ''} />
          {importing ? 'Importing CSV...' : 'Import/Reseed SFPD CSV Fixture'}
        </button>
      </div>

      {importMessage && (
        <div style={{
          background: 'rgba(16, 185, 129, 0.15)',
          border: '1px solid rgba(16, 185, 129, 0.4)',
          color: '#34d399',
          padding: '0.75rem 1rem',
          borderRadius: 'var(--radius-sm)',
          fontSize: '0.85rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <CheckCircle2 size={16} />
          {importMessage}
        </div>
      )}

      {/* Filter and Search Bar */}
      <form onSubmit={handleSearchSubmit} className="glass-panel" style={{ padding: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        
        <div style={{ flex: 1, minWidth: '220px', position: 'relative' }}>
          <Search size={18} color="var(--text-dim)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '2.5rem' }}
            placeholder="Search incident descriptions by keyword..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>

        <div style={{ width: '200px' }}>
          <select
            className="form-select"
            value={category}
            onChange={e => { setCategory(e.target.value); setPage(1); }}
          >
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat === 'All' ? 'All Categories' : cat}</option>
            ))}
          </select>
        </div>

        <button type="submit" className="btn-primary" style={{ padding: '0.65rem 1.1rem' }}>
          Search
        </button>

      </form>

      {/* Records Table / Cards */}
      {loading ? (
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          <Database size={32} style={{ color: 'var(--accent-cyan)', marginBottom: '0.5rem' }} />
          <p>Querying historical SFPD records database...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          <Database size={36} style={{ color: 'var(--text-dim)', marginBottom: '0.5rem' }} />
          <h3>No historical records found</h3>
          <p style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>No records match your query filters.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {items.map(rec => (
            <div key={rec.id} className="glass-panel" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span className="badge badge-historical">HISTORICAL RECORD</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    Incident #{rec.source_incident_id || rec.id.substring(0, 8)}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <span className="badge badge-reason">{rec.crime_category || 'Uncategorized'}</span>
                  {rec.crime_subcategory && (
                    <span className="badge badge-reason" style={{ background: 'rgba(6, 182, 212, 0.12)', color: '#38bdf8' }}>
                      {rec.crime_subcategory}
                    </span>
                  )}
                </div>
              </div>

              <p style={{ fontSize: '0.925rem', color: '#f8fafc', lineHeight: 1.5, marginBottom: '0.85rem' }}>
                {rec.incident_description}
              </p>

              <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                {rec.neighborhood && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                    <MapPin size={13} color="var(--accent-emerald)" /> {rec.neighborhood}
                  </span>
                )}
                {rec.incident_datetime && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Calendar size={13} /> {rec.incident_datetime}
                  </span>
                )}
                {rec.resolution && (
                  <span>Status: <strong style={{ color: 'var(--text-muted)' }}>{rec.resolution}</strong></span>
                )}
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Pagination Footer */}
      <div className="glass-panel" style={{ padding: '0.85rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Showing page <strong>{page}</strong> of <strong>{totalPages}</strong> ({total} total records)
        </span>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            className="btn-secondary"
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
            style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
          >
            <ChevronLeft size={16} /> Previous
          </button>
          
          <button
            className="btn-secondary"
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
            style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
          >
            Next <ChevronRight size={16} />
          </button>
        </div>
      </div>

    </div>
  );
}
