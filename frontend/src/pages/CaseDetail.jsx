import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, Sparkles, Sliders, CheckCircle2, XCircle, Info, ChevronDown, ChevronUp, 
  MapPin, Calendar, Tag, Database, ShieldAlert, FileText, CheckSquare, Printer, Eye, Share2, Layers
} from 'lucide-react';
import { fetchDemoCase, findSimilarCases, fetchCaseBriefing } from '../services/api';

export default function CaseDetail() {
  const { id: caseId } = useParams();

  const [demoCase, setDemoCase] = useState(null);
  const [similarResults, setSimilarResults] = useState(null);
  const [briefing, setBriefing] = useState(null);
  const [loadingCase, setLoadingCase] = useState(true);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [error, setError] = useState(null);
  const [topK, setTopK] = useState(5);
  const [activeSubTab, setActiveSubTab] = useState('briefing'); // 'briefing' | 'matches'
  const [expandedCard, setExpandedCard] = useState(null);
  const [checkedLeads, setCheckedLeads] = useState({});
  const [showPrintModal, setShowPrintModal] = useState(false);

  useEffect(() => {
    loadCaseDetails();
  }, [caseId]);

  const loadCaseDetails = async () => {
    try {
      setLoadingCase(true);
      setError(null);
      const c = await fetchDemoCase(caseId);
      setDemoCase(c);
      runSimilarityAndBriefing(c.id, topK);
    } catch (err) {
      setError(err.message || 'Failed to load case details.');
      setLoadingCase(false);
    }
  };

  const runSimilarityAndBriefing = async (id, k) => {
    try {
      setLoadingSearch(true);
      const [simRes, briefRes] = await Promise.all([
        findSimilarCases(id, k),
        fetchCaseBriefing(id, k).catch(() => null)
      ]);
      setSimilarResults(simRes);
      setBriefing(briefRes);
    } catch (err) {
      setError(err.message || 'Error running similarity search.');
    } finally {
      setLoadingCase(false);
      setLoadingSearch(false);
    }
  };

  const handleTopKChange = (newK) => {
    setTopK(newK);
    if (demoCase) {
      runSimilarityAndBriefing(demoCase.id, newK);
    }
  };

  const toggleLeadCheck = (leadId) => {
    setCheckedLeads(prev => ({ ...prev, [leadId]: !prev[leadId] }));
  };

  const getScoreBadgeClass = (score) => {
    if (score >= 75) return 'badge-score-high';
    if (score >= 45) return 'badge-score-med';
    return 'badge-score-low';
  };

  if (loadingCase && !demoCase) {
    return (
      <div className="dev-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        <Sparkles size={32} style={{ marginBottom: '1rem', color: 'var(--primary)' }} />
        <p>Analyzing case narrative and extracting investigative leads...</p>
      </div>
    );
  }

  if (error || !demoCase) {
    return (
      <div className="dev-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--accent-rose)' }}>
        <ShieldAlert size={42} style={{ marginBottom: '1rem' }} />
        <h3>Error Loading Case</h3>
        <p style={{ marginTop: '0.5rem', color: 'var(--text-muted)' }}>{error || 'Case not found'}</p>
        <button className="btn-secondary" onClick={() => window.history.back()} style={{ marginTop: '1.25rem' }}>
          <ArrowLeft size={16} /> Back to Cases
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Link to="/cases" className="btn-secondary" style={{ padding: '0.4rem 0.75rem' }}>
            <ArrowLeft size={16} /> Back to Cases
          </Link>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="badge badge-demo">TARGET CASE</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>ID: {demoCase.id}</span>
            </div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '0.2rem' }}>{demoCase.title}</h1>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn-secondary" onClick={() => setShowPrintModal(true)}>
            <Printer size={16} /> Print Case Briefing
          </button>
        </div>
      </div>

      {/* Case Overview Panel */}
      <div className="dev-panel" style={{ padding: '1.25rem', borderLeft: '4px solid var(--primary)' }}>
        <p style={{ fontSize: '0.95rem', color: '#f9fafb', lineHeight: 1.5, marginBottom: '1rem' }}>
          "{demoCase.incident_description}"
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', fontSize: '0.8rem' }}>
          <span className="badge badge-reason">
            <Tag size={12} /> Category: {demoCase.crime_category}
          </span>
          {demoCase.crime_subcategory && (
            <span className="badge badge-reason" style={{ background: 'rgba(6, 182, 212, 0.12)', color: '#38bdf8' }}>
              {demoCase.crime_subcategory}
            </span>
          )}
          {demoCase.neighborhood && (
            <span className="badge badge-reason" style={{ background: 'rgba(16, 185, 129, 0.12)', color: '#34d399' }}>
              <MapPin size={12} /> {demoCase.neighborhood}
            </span>
          )}
          {demoCase.incident_datetime && (
            <span className="badge badge-reason" style={{ background: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-muted)' }}>
              <Calendar size={12} /> {demoCase.incident_datetime}
            </span>
          )}
        </div>
      </div>

      {/* Sub Navigation View Tabs */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--bg-card-border)', paddingBottom: '0.5rem' }}>
        
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            className={`btn-secondary ${activeSubTab === 'briefing' ? 'btn-primary' : ''}`}
            onClick={() => setActiveSubTab('briefing')}
            style={{ fontSize: '0.85rem' }}
          >
            <FileText size={16} />
            Investigative Lead Briefing (Problem Solver)
          </button>
          
          <button
            className={`btn-secondary ${activeSubTab === 'matches' ? 'btn-primary' : ''}`}
            onClick={() => setActiveSubTab('matches')}
            style={{ fontSize: '0.85rem' }}
          >
            <Layers size={16} />
            Matched SFPD Cases ({similarResults?.results?.length || 0})
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Evaluate Top:</label>
          <select
            className="form-select"
            style={{ width: '75px', padding: '0.35rem 0.5rem' }}
            value={topK}
            onChange={e => handleTopKChange(parseInt(e.target.value))}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(k => (
              <option key={k} value={k}>{k}</option>
            ))}
          </select>
        </div>

      </div>

      {/* TAB 1: INVESTIGATIVE LEAD BRIEFING */}
      {activeSubTab === 'briefing' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Extracted Entity Matrix */}
          <div className="dev-panel" style={{ padding: '1.25rem' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.03em', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              🔍 Extracted Entity & Modus Operandi Matrix
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              
              <div style={{ background: '#0f172a', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid #1e293b' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#93c5fd', marginBottom: '0.5rem' }}>
                  TARGET STOLEN PROPERTY
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                  {briefing?.entities?.stolen_property?.map((item, idx) => (
                    <span key={idx} className="badge badge-reason" style={{ background: 'rgba(59, 130, 246, 0.15)' }}>
                      {item}
                    </span>
                  )) || <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Unspecified Property</span>}
                </div>
              </div>

              <div style={{ background: '#0f172a', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid #1e293b' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#38bdf8', marginBottom: '0.5rem' }}>
                  ENTRY METHOD / MO PATTERN
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                  {briefing?.entities?.entry_methods?.map((method, idx) => (
                    <span key={idx} className="badge badge-reason" style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#38bdf8' }}>
                      {method}
                    </span>
                  )) || <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>General Entry</span>}
                </div>
              </div>

              <div style={{ background: '#0f172a', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid #1e293b' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#34d399', marginBottom: '0.5rem' }}>
                  TOP MATCH SCORE & EVALUATION
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#34d399' }}>
                  {briefing?.top_match_score || 0}% Similarity
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                  Evaluated {briefing?.total_similar_historical_evaluated || 0} historical cases
                </div>
              </div>

            </div>
          </div>

          {/* Actionable Lead Checklist */}
          <div className="dev-panel" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.03em', color: 'var(--text-muted)' }}>
                  📋 Actionable Evidence & Lead Checklist
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                  Recommended investigative protocol actions derived from historical incident patterns
                </p>
              </div>

              <span style={{ fontSize: '0.8rem', color: '#34d399', fontWeight: 600 }}>
                {Object.values(checkedLeads).filter(Boolean).length} / {briefing?.actionable_leads?.length || 0} Completed
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {briefing?.actionable_leads?.map((lead) => {
                const isChecked = !!checkedLeads[lead.id];
                return (
                  <div
                    key={lead.id}
                    className={`checklist-item ${isChecked ? 'checked' : ''}`}
                    onClick={() => toggleLeadCheck(lead.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}}
                      style={{ marginTop: '3px', cursor: 'pointer' }}
                    />
                    
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                        <span className={`badge ${lead.priority === 'HIGH' ? 'badge-priority-high' : 'badge-priority-medium'}`}>
                          {lead.priority} PRIORITY
                        </span>
                        <strong style={{ fontSize: '0.9rem', color: isChecked ? '#9ca3af' : '#f9fafb', textDecoration: isChecked ? 'line-through' : 'none' }}>
                          {lead.action_item}
                        </strong>
                      </div>
                      <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                        {lead.description}
                      </p>
                    </div>

                  </div>
                );
              })}
            </div>

          </div>

          {/* Historical Resolution Analysis */}
          <div className="dev-panel" style={{ padding: '1.25rem' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.03em', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
              📊 Historical Clearance & Resolution Rate Analysis
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '1rem' }}>
              Breakdown of how past similar cases in the SFPD dataset were resolved by law enforcement
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
              {briefing?.historical_resolution_stats && Object.entries(briefing.historical_resolution_stats).map(([status, count]) => (
                <div key={status} style={{ background: '#0f172a', padding: '0.75rem 1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid #1e293b', flex: '1', minWidth: '180px' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{status}</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: status.toLowerCase().includes('arrest') ? '#34d399' : '#fbbf24', marginTop: '0.1rem' }}>
                    {count} <span style={{ fontSize: '0.8rem', fontWeight: 400, color: 'var(--text-dim)' }}>case(s)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: MATCHED HISTORICAL CASES */}
      {activeSubTab === 'matches' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          {loadingSearch ? (
            <div className="dev-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <Sparkles size={28} style={{ color: 'var(--primary)', marginBottom: '0.5rem' }} />
              <p>Re-calculating TF-IDF document vectors...</p>
            </div>
          ) : !similarResults || similarResults.results.length === 0 ? (
            <div className="dev-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <Database size={32} style={{ marginBottom: '0.5rem' }} />
              <p>No historical records met the similarity threshold.</p>
            </div>
          ) : (
            similarResults.results.map((res, index) => {
              const isExpanded = expandedCard === res.historical_record_id;
              return (
                <div key={res.historical_record_id} className="dev-panel" style={{ padding: '1.25rem' }}>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.85rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{
                        background: '#1f2937',
                        color: 'var(--text-muted)',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        width: '30px',
                        height: '30px',
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        #{index + 1}
                      </div>

                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span className="badge badge-historical">HISTORICAL RECORD</span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                            Incident #{res.source_incident_id || res.historical_record_id.substring(0, 8)}
                          </span>
                        </div>
                        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#f9fafb', marginTop: '0.15rem' }}>
                          {res.crime_subcategory || res.crime_category || 'SFPD Incident'}
                        </h3>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div className={`badge ${getScoreBadgeClass(res.similarity_score)}`} style={{ fontSize: '1rem', padding: '0.3rem 0.75rem' }}>
                        {res.similarity_score}% Similarity
                      </div>
                    </div>
                  </div>

                  <div style={{ background: '#0f172a', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid #1e293b', marginBottom: '0.85rem' }}>
                    <p style={{ fontSize: '0.875rem', color: '#f9fafb', lineHeight: 1.5 }}>
                      "{res.incident_description || 'No narrative text provided.'}"
                    </p>
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.75rem' }}>
                    {res.match_reasons.map((reason, rIdx) => (
                      <span key={rIdx} className="badge badge-reason">
                        <CheckCircle2 size={12} color="#3b82f6" /> {reason}
                      </span>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => setExpandedCard(isExpanded ? null : res.historical_record_id)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#3b82f6',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      padding: 0
                    }}
                  >
                    {isExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                    {isExpanded ? 'Hide Factor Breakdown' : 'View Mathematical Factor Breakdown'}
                  </button>

                  {isExpanded && (
                    <div style={{ marginTop: '0.85rem', borderTop: '1px solid var(--bg-card-border)', paddingTop: '0.85rem' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                        <thead>
                          <tr style={{ borderBottom: '1px solid var(--bg-card-border)', color: 'var(--text-muted)' }}>
                            <th style={{ padding: '0.4rem', textAlign: 'left' }}>Factor</th>
                            <th style={{ padding: '0.4rem', textAlign: 'left' }}>Status</th>
                            <th style={{ padding: '0.4rem', textAlign: 'left' }}>Weight</th>
                            <th style={{ padding: '0.4rem', textAlign: 'left' }}>Explanation</th>
                          </tr>
                        </thead>
                        <tbody>
                          {res.match_factors.map((factor, fIdx) => (
                            <tr key={fIdx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                              <td style={{ padding: '0.4rem', fontWeight: 600 }}>{factor.factor_name}</td>
                              <td style={{ padding: '0.4rem', color: factor.matched ? '#34d399' : 'var(--text-dim)' }}>
                                {factor.matched ? 'Match' : 'Mismatch'}
                              </td>
                              <td style={{ padding: '0.4rem', fontFamily: 'var(--font-mono)' }}>{(factor.weight * 100).toFixed(0)}%</td>
                              <td style={{ padding: '0.4rem', color: 'var(--text-muted)' }}>{factor.explanation}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                </div>
              );
            })
          )}

        </div>
      )}

      {/* PRINTABLE DOSSIER MODAL */}
      {showPrintModal && (
        <div className="modal-backdrop" onClick={() => setShowPrintModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Formal Case Intelligence Dossier</h2>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn-primary" onClick={() => window.print()}>
                  <Printer size={16} /> Print / Save PDF
                </button>
                <button className="btn-secondary" onClick={() => setShowPrintModal(false)}>
                  Close
                </button>
              </div>
            </div>

            {/* Printable Brief Document */}
            <div style={{ background: '#ffffff', color: '#000000', padding: '2rem', borderRadius: '8px', fontFamily: 'sans-serif' }}>
              <div style={{ borderBottom: '2px solid #000', paddingBottom: '0.75rem', marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>KAVACH CASE ANALYSIS DOSSIER</h1>
                  <p style={{ fontSize: '0.85rem', color: '#666', margin: 0 }}>Incident Similarity & Actionable Lead Report</p>
                </div>
                <div style={{ textAlign: 'right', fontSize: '0.8rem', color: '#666' }}>
                  <div><strong>Date:</strong> {new Date().toLocaleDateString()}</div>
                  <div><strong>Case ID:</strong> {demoCase.id.substring(0, 8)}</div>
                </div>
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '1.1rem', margin: '0 0 0.4rem 0', color: '#111' }}>Case Title: {demoCase.title}</h3>
                <p style={{ fontSize: '0.9rem', color: '#333', background: '#f5f5f5', padding: '0.75rem', borderRadius: '4px', margin: 0 }}>
                  "{demoCase.incident_description}"
                </p>
              </div>

              <div style={{ display: 'flex', gap: '2rem', marginBottom: '1.25rem', fontSize: '0.85rem' }}>
                <div><strong>Category:</strong> {demoCase.crime_category}</div>
                <div><strong>Subcategory:</strong> {demoCase.crime_subcategory || 'N/A'}</div>
                <div><strong>Neighborhood:</strong> {demoCase.neighborhood || 'N/A'}</div>
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <h4 style={{ fontSize: '1rem', borderBottom: '1px solid #ddd', paddingBottom: '0.25rem', marginBottom: '0.5rem' }}>1. Actionable Lead Checklist</h4>
                <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.85rem', lineHeight: 1.6 }}>
                  {briefing?.actionable_leads?.map(l => (
                    <li key={l.id}>
                      <strong>[{l.priority} PRIORITY] {l.action_item}:</strong> {l.description}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 style={{ fontSize: '1rem', borderBottom: '1px solid #ddd', paddingBottom: '0.25rem', marginBottom: '0.5rem' }}>2. Top Matched Historical SFPD Cases</h4>
                <ol style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.85rem', lineHeight: 1.5 }}>
                  {similarResults?.results?.slice(0, 3).map((r, idx) => (
                    <li key={idx} style={{ marginBottom: '0.5rem' }}>
                      <strong>Incident #{r.source_incident_id || 'SFPD'} ({r.similarity_score}% Match):</strong> "{r.incident_description}" — <em>Reasons: {r.match_reasons.join(', ')}</em>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
