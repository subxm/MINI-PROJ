import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PlusCircle, Sparkles, AlertCircle, ArrowLeft } from 'lucide-react';
import { createDemoCase } from '../services/api';

const DEMO_PRESETS = [
  {
    label: "Residential Burglary",
    title: "Residential burglary --- stolen electronics",
    crime_category: "Burglary",
    crime_subcategory: "Burglary - Residential",
    neighborhood: "Tenderloin",
    incident_description: "A laptop and silver wrist watch were reported stolen from a residence after entry was forced through a rear window."
  },
  {
    label: "Vehicle Theft / Break-in",
    title: "Vehicle window smashed --- stolen laptop bag",
    crime_category: "Larceny Theft",
    crime_subcategory: "Theft From Vehicle",
    neighborhood: "Fisherman's Wharf",
    incident_description: "Vehicle window shattered and leather backpack containing laptop computer stolen from back seat."
  },
  {
    label: "Commercial Office Theft",
    title: "Commercial burglary --- startup office breach",
    crime_category: "Burglary",
    crime_subcategory: "Burglary - Commercial",
    neighborhood: "South of Market",
    incident_description: "Tech startup office breached after side door lock defeated; 3 laptops and monitor monitors removed."
  }
];

const CATEGORIES = [
  "Burglary",
  "Larceny Theft",
  "Robbery",
  "Motor Vehicle Theft",
  "Vandalism",
  "Financial Crime",
  "Assault",
  "Unknown"
];

const NEIGHBORHOODS = [
  "Tenderloin",
  "Mission",
  "South of Market",
  "Financial District",
  "Western Addition",
  "Fisherman's Wharf",
  "North Beach",
  "Sunset"
];

export default function NewCase({ onCaseCreated }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    incident_description: '',
    crime_category: 'Burglary',
    crime_subcategory: '',
    incident_datetime: new Date().toISOString().slice(0, 16),
    neighborhood: 'Tenderloin'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const applyPreset = (preset) => {
    setFormData({
      title: preset.title,
      incident_description: preset.incident_description,
      crime_category: preset.crime_category,
      crime_subcategory: preset.crime_subcategory,
      incident_datetime: new Date().toISOString().slice(0, 16),
      neighborhood: preset.neighborhood
    });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.title.trim()) {
      setError('Case title is required.');
      return;
    }
    if (!formData.incident_description.trim()) {
      setError('Incident description is required.');
      return;
    }

    try {
      setLoading(true);
      const newCase = await createDemoCase({
        ...formData,
        title: formData.title.trim(),
        incident_description: formData.incident_description.trim()
      });
      if (onCaseCreated) onCaseCreated();
      navigate(`/cases/${newCase.id}`);
    } catch (err) {
      setError(err.message || 'Failed to create demo case.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <Link to="/cases" className="btn-secondary" style={{ padding: '0.4rem 0.75rem' }}>
          <ArrowLeft size={16} /> Back to Cases
        </Link>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Record New Demo Case</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Record a new incident to evaluate against historical SFPD records</p>
        </div>
      </div>

      {/* Preset Launcher Bar */}
      <div className="dev-panel" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: '#a5b4fc', fontSize: '0.85rem', fontWeight: 700 }}>
          <Sparkles size={16} /> 1-CLICK DEMO CASE PRESETS
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {DEMO_PRESETS.map((p, idx) => (
            <button
              key={idx}
              type="button"
              className="btn-secondary"
              onClick={() => applyPreset(p)}
              style={{ fontSize: '0.825rem', padding: '0.45rem 0.85rem' }}
            >
              + {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="dev-panel" style={{ padding: '2rem' }}>
        
        {error && (
          <div style={{
            background: 'rgba(244, 63, 94, 0.12)',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            color: '#fda4af',
            padding: '0.85rem 1rem',
            borderRadius: 'var(--radius-sm)',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            fontSize: '0.875rem'
          }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <div className="form-group">
          <label className="form-label">Case Title <span style={{ color: 'var(--accent-rose)' }}>*</span></label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Residential Burglary --- Stolen electronics"
            value={formData.title}
            onChange={e => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Incident Description <span style={{ color: 'var(--accent-rose)' }}>*</span></label>
          <textarea
            className="form-textarea"
            placeholder="Describe the incident narrative details (e.g. forced rear window entry, stolen laptop and watch)..."
            value={formData.incident_description}
            onChange={e => setFormData({ ...formData, incident_description: e.target.value })}
            required
          />
          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
            Narrative text is vector-parsed using TF-IDF for cosine similarity matching against 10,000+ historical records.
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          
          <div className="form-group">
            <label className="form-label">Crime Category</label>
            <select
              className="form-select"
              value={formData.crime_category}
              onChange={e => setFormData({ ...formData, crime_category: e.target.value })}
            >
              {CATEGORIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Crime Subcategory (Optional)</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Burglary - Residential"
              value={formData.crime_subcategory}
              onChange={e => setFormData({ ...formData, crime_subcategory: e.target.value })}
            />
          </div>

        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          
          <div className="form-group">
            <label className="form-label">Neighborhood / Area (Optional)</label>
            <select
              className="form-select"
              value={formData.neighborhood}
              onChange={e => setFormData({ ...formData, neighborhood: e.target.value })}
            >
              <option value="">Select Neighborhood</option>
              {NEIGHBORHOODS.map(n => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Incident Datetime (Optional)</label>
            <input
              type="datetime-local"
              className="form-input"
              value={formData.incident_datetime}
              onChange={e => setFormData({ ...formData, incident_datetime: e.target.value })}
            />
          </div>

        </div>

        <div style={{ borderTop: '1px solid var(--bg-card-border)', paddingTop: '1.5rem', marginTop: '1rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
          <Link to="/cases" className="btn-secondary">
            Cancel
          </Link>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? (
              <span>Saving & Analyzing...</span>
            ) : (
              <>
                <PlusCircle size={17} /> Save & Open Lead Briefing
              </>
            )}
          </button>
        </div>

      </form>

    </div>
  );
}
