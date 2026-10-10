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
      </div>

      {/* Filter and Search Bar */}
      <form onSubmit={handleSearchSubmit} className="ui-card" style={{ padding: '1rem', display: 'flex', gap: '0.85rem', flexWrap: 'wrap', alignItems: 'center' }}>
        
        <div style={{ flex: 1, minWidth: '220px', position: 'relative' }}>
          <Search size={17} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '2.5rem' }}
            placeholder="Search incident descriptions by keyword..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>

        <div style={{ width: '180px' }}>
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

        <button type="submit" className="btn-primary" style={{ padding: '0.6rem 1.15rem', fontSize: '0.875rem' }}>
          Search
        </button>

      </form>

      {/* Records Table / Cards */}
      {loading ? (
        <div className="ui-card" style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
          <Database size={32} style={{ color: '#38bdf8', marginBottom: '0.5rem' }} />
          <p>Querying historical SFPD records database...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="ui-card" style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
          <Database size={36} style={{ color: '#64748b', marginBottom: '0.5rem' }} />
          <h3 style={{ fontSize: '1.1rem' }}>No historical records found</h3>
          <p style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>No records match your query filters.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {items.map(rec => (
            <div key={rec.id} className="ui-card" style={{ padding: '1.15rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.6rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span className="badge badge-historical" style={{ fontSize: '0.7rem' }}>HISTORICAL RECORD</span>
                  <span style={{ fontSize: '0.775rem', color: '#64748b', fontFamily: 'var(--font-mono)' }}>
                    Incident #{rec.source_incident_id || rec.id.substring(0, 8)}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <span className="badge badge-reason" style={{ fontSize: '0.75rem' }}>{rec.crime_category || 'Uncategorized'}</span>
                  {rec.crime_subcategory && (
                    <span className="badge badge-reason" style={{ background: 'rgba(56, 189, 248, 0.12)', color: '#38bdf8', fontSize: '0.75rem' }}>
                      {rec.crime_subcategory}
                    </span>
                  )}
                </div>
              </div>

              <p style={{ fontSize: '0.9rem', color: '#f8fafc', lineHeight: 1.5, marginBottom: '0.75rem' }}>
                {rec.incident_description}
              </p>

              <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', fontSize: '0.775rem', color: '#64748b' }}>
                {rec.neighborhood && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                    <MapPin size={12} color="#10b981" /> {rec.neighborhood}
                  </span>
                )}
                {rec.incident_datetime && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Calendar size={12} /> {rec.incident_datetime}
                  </span>
                )}
                {rec.resolution && (
                  <span>Status: <strong style={{ color: '#cbd5e1' }}>{rec.resolution}</strong></span>
                )}
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Pagination Footer */}
      <div className="ui-card" style={{ padding: '0.85rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.825rem', color: '#94a3b8' }}>
          Showing page <strong>{page}</strong> of <strong>{totalPages}</strong> ({total.toLocaleString()} total records)
        </span>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            className="btn-secondary"
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
            style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
          >
            <ChevronLeft size={15} /> Previous
          </button>
          
          <button
            className="btn-secondary"
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
            style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
          >
            Next <ChevronRight size={15} />
          </button>
        </div>
      </div>

    </div>
  );
}
