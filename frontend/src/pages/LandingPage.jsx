import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Shield, Database, FileText, CheckCircle2, ArrowRight, Info, Layers, Search, 
  Cpu, CheckSquare, Printer, Zap, Server, Activity, ArrowUpRight, Target, Lock, FileSpreadsheet
} from 'lucide-react';

export default function LandingPage({ healthInfo }) {
  const recordCount = healthInfo?.historical_records_count || 10000;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3.5rem', paddingBottom: '2rem' }}>
      
      {/* Hero Section */}
      <section style={{ 
        position: 'relative',
        background: 'linear-gradient(180deg, #0f172a 0%, #080c14 100%)',
        border: '1px solid #1e293b',
        borderRadius: 'var(--radius-lg)',
        padding: '3.5rem 2.5rem',
        overflow: 'hidden'
      }}>
        <div style={{ maxWidth: '880px', position: 'relative', zIndex: 2 }}>
          
          <h1 style={{ 
            fontFamily: 'var(--font-display)',
            fontSize: '2.85rem', 
            fontWeight: 700, 
            lineHeight: 1.15, 
            color: '#f8fafc',
            marginBottom: '1.25rem',
            letterSpacing: '-0.025em'
          }}>
            KAVACH: Smart Crime Case Search & Investigation Support
          </h1>

          <p style={{ 
            color: '#94a3b8', 
            fontSize: '1.1rem', 
            lineHeight: 1.7, 
            marginBottom: '2.5rem',
            maxWidth: '780px'
          }}>
            Instead of spending hours manually reading past crime files, KAVACH instantly searches over 10,000 past police records to find similar cases, pulls out important clues (like stolen laptops or broken windows), and creates a simple action checklist for officers.
          </p>

          {/* Quick Metrics Cards Grid */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
            gap: '1rem', 
            borderTop: '1px solid #1e293b', 
            paddingTop: '2rem' 
          }}>
            <div style={{ background: '#0b1120', padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid #1e293b' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 700, color: '#38bdf8' }}>
                {recordCount.toLocaleString()}+
              </div>
              <div style={{ fontSize: '0.825rem', color: '#64748b', fontWeight: 500, marginTop: '0.2rem' }}>
                Past SFPD Police Records
              </div>
            </div>

            <div style={{ background: '#0b1120', padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid #1e293b' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 700, color: '#3b82f6' }}>
                Instant
              </div>
              <div style={{ fontSize: '0.825rem', color: '#64748b', fontWeight: 500, marginTop: '0.2rem' }}>
                Smart Text Search
              </div>
            </div>

            <div style={{ background: '#0b1120', padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid #1e293b' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 700, color: '#a5b4fc' }}>
                Cloud Ready
              </div>
              <div style={{ fontSize: '0.825rem', color: '#64748b', fontWeight: 500, marginTop: '0.2rem' }}>
                Supabase Database
              </div>
            </div>

            <div style={{ background: '#0b1120', padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid #1e293b' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 700, color: '#fbbf24' }}>
                1-Click
              </div>
              <div style={{ fontSize: '0.825rem', color: '#64748b', fontWeight: 500, marginTop: '0.2rem' }}>
                Printable Case Reports
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Problem vs Solution Comparison Section */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
        
        {/* Legacy Manual Approach */}
        <div style={{ 
          background: '#0f172a', 
          border: '1px solid #1e293b', 
          borderTop: '4px solid #ef4444',
          borderRadius: 'var(--radius-lg)', 
          padding: '2rem' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
            <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '0.5rem', borderRadius: 'var(--radius-sm)' }}>
              <Zap size={22} color="#ef4444" />
            </div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#f8fafc', fontFamily: 'var(--font-heading)' }}>
              The Old Way of Investigating
            </h2>
          </div>
          
          <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: 1.65, marginBottom: '1.25rem' }}>
            When a new theft or burglary is reported, officers have to manually scroll through hundreds of old PDF files to see if the same thief used a similar entry method before.
          </p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.9rem', color: '#cbd5e1' }}>
              <span style={{ color: '#ef4444', fontWeight: 'bold' }}>✕</span>
              <span>Takes 4-6 hours per case reading paper reports</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.9rem', color: '#cbd5e1' }}>
              <span style={{ color: '#ef4444', fontWeight: 'bold' }}>✕</span>
              <span>Easy to miss key details like stolen serial numbers</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.9rem', color: '#cbd5e1' }}>
              <span style={{ color: '#ef4444', fontWeight: 'bold' }}>✕</span>
              <span>No quick checklist for what evidence to collect first</span>
            </div>
          </div>
        </div>

        {/* KAVACH Automated System */}
        <div style={{ 
          background: '#0f172a', 
          border: '1px solid #1e293b', 
          borderTop: '4px solid #10b981',
          borderRadius: 'var(--radius-lg)', 
          padding: '2rem' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
            <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '0.5rem', borderRadius: 'var(--radius-sm)' }}>
              <CheckCircle2 size={22} color="#10b981" />
            </div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#f8fafc', fontFamily: 'var(--font-heading)' }}>
              The KAVACH Way
            </h2>
          </div>
          
          <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: 1.65, marginBottom: '1.25rem' }}>
            KAVACH automatically reads the crime narrative, compares key words and categories against 10,000+ past police reports, and highlights matching cases in seconds.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.9rem', color: '#cbd5e1' }}>
              <span style={{ color: '#10b981', fontWeight: 'bold' }}>✓</span>
              <span>Instantly ranks top matching past crimes in seconds</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.9rem', color: '#cbd5e1' }}>
              <span style={{ color: '#10b981', fontWeight: 'bold' }}>✓</span>
              <span>Pulls out stolen items (laptops, watches, cash) automatically</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.9rem', color: '#cbd5e1' }}>
              <span style={{ color: '#10b981', fontWeight: 'bold' }}>✓</span>
              <span>Gives officers a step-by-step checklist (check CCTV, notify pawn shops)</span>
            </div>
          </div>
        </div>

      </section>

      {/* Core Analytical Capabilities Grid */}
      <section style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 'var(--radius-lg)', padding: '2.5rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#f8fafc', fontFamily: 'var(--font-heading)', marginBottom: '0.35rem' }}>
            What KAVACH Does
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
            Four main tools that turn raw crime stories into useful investigation leads
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
          
          <div style={{ background: '#080c14', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid #1e293b' }}>
            <div style={{ background: 'rgba(6, 182, 212, 0.1)', width: 'fit-content', padding: '0.6rem', borderRadius: 'var(--radius-sm)', color: '#06b6d4', marginBottom: '1rem' }}>
              <Cpu size={24} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#f8fafc', marginBottom: '0.5rem', fontFamily: 'var(--font-heading)' }}>
              1. Smart Match Search
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#94a3b8', lineHeight: 1.6 }}>
              Compares the text description, crime type, and location against past records to find the closest matching incidents.
            </p>
          </div>

          <div style={{ background: '#080c14', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid #1e293b' }}>
            <div style={{ background: 'rgba(16, 185, 129, 0.1)', width: 'fit-content', padding: '0.6rem', borderRadius: 'var(--radius-sm)', color: '#10b981', marginBottom: '1rem' }}>
              <Layers size={24} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#f8fafc', marginBottom: '0.5rem', fontFamily: 'var(--font-heading)' }}>
              2. Clue & Item Finder
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#94a3b8', lineHeight: 1.6 }}>
              Automatically scans the story to extract stolen items (MacBooks, jewelry, cash) and entry methods (broken window, forced lock).
            </p>
          </div>

          <div style={{ background: '#080c14', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid #1e293b' }}>
            <div style={{ background: 'rgba(99, 102, 241, 0.1)', width: 'fit-content', padding: '0.6rem', borderRadius: 'var(--radius-sm)', color: '#818cf8', marginBottom: '1rem' }}>
              <CheckSquare size={24} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#f8fafc', marginBottom: '0.5rem', fontFamily: 'var(--font-heading)' }}>
              3. Investigator Action Plan
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#94a3b8', lineHeight: 1.6 }}>
              Creates an easy task list for officers: request nearby CCTV footage, send alerts to pawn shops, and gather toolmarks.
            </p>
          </div>

          <div style={{ background: '#080c14', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid #1e293b' }}>
            <div style={{ background: 'rgba(245, 158, 11, 0.1)', width: 'fit-content', padding: '0.6rem', borderRadius: 'var(--radius-sm)', color: '#fbbf24', marginBottom: '1rem' }}>
              <Printer size={24} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#f8fafc', marginBottom: '0.5rem', fontFamily: 'var(--font-heading)' }}>
              4. Printable Case Summary
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#94a3b8', lineHeight: 1.6 }}>
              Generates a clean 1-page report with all matching cases and checklists ready to print for team meetings.
            </p>
          </div>

        </div>
      </section>

      {/* Simple 4-Step Process */}
      <section style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 'var(--radius-lg)', padding: '2.5rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#f8fafc', fontFamily: 'var(--font-heading)', marginBottom: '0.35rem' }}>
            How It Works in 4 Simple Steps
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
            From entering a crime story to getting a printable action report
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '1.25rem' }}>
          
          <div style={{ background: '#080c14', padding: '1.35rem', borderRadius: 'var(--radius-md)', border: '1px solid #1e293b', position: 'relative' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#38bdf8', letterSpacing: '0.05em', marginBottom: '0.5rem', fontFamily: 'var(--font-heading)' }}>
              STEP 01
            </div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#f8fafc', marginBottom: '0.4rem', fontFamily: 'var(--font-heading)' }}>
              Enter Crime Details
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.55 }}>
              Type in what happened, including the story, crime type, and neighborhood.
            </p>
          </div>

          <div style={{ background: '#080c14', padding: '1.35rem', borderRadius: 'var(--radius-md)', border: '1px solid #1e293b' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#10b981', letterSpacing: '0.05em', marginBottom: '0.5rem', fontFamily: 'var(--font-heading)' }}>
              STEP 02
            </div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#f8fafc', marginBottom: '0.4rem', fontFamily: 'var(--font-heading)' }}>
              Find Similar Past Cases
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.55 }}>
              The system automatically scans 10,000+ past police logs and shows the top matches.
            </p>
          </div>

          <div style={{ background: '#080c14', padding: '1.35rem', borderRadius: 'var(--radius-md)', border: '1px solid #1e293b' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#a5b4fc', letterSpacing: '0.05em', marginBottom: '0.5rem', fontFamily: 'var(--font-heading)' }}>
              STEP 03
            </div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#f8fafc', marginBottom: '0.4rem', fontFamily: 'var(--font-heading)' }}>
              Extract Clues & Items
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.55 }}>
              Separates stolen items and burglary methods into clean tags for quick reading.
            </p>
          </div>

          <div style={{ background: '#080c14', padding: '1.35rem', borderRadius: 'var(--radius-md)', border: '1px solid #1e293b' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#fbbf24', letterSpacing: '0.05em', marginBottom: '0.5rem', fontFamily: 'var(--font-heading)' }}>
              STEP 04
            </div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#f8fafc', marginBottom: '0.4rem', fontFamily: 'var(--font-heading)' }}>
              Get Action Plan & Print
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.55 }}>
              Follow the generated evidence checklist and print out the summary report.
            </p>
          </div>

        </div>
      </section>

      {/* Operational Scope & Transparency Boundaries */}
      <section style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 'var(--radius-lg)', padding: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
          <Info size={22} color="#fbbf24" />
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#f8fafc', fontFamily: 'var(--font-heading)' }}>
            System Rules &amp; Transparency
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: '1.25rem' }}>
          
          <div style={{ background: '#080c14', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid #1e293b' }}>
            <div style={{ color: '#f8fafc', fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.35rem', fontFamily: 'var(--font-heading)' }}>
              No Crime Prediction
            </div>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.55 }}>
              KAVACH does not predict where future crimes will happen or score crime risk.
            </p>
          </div>

          <div style={{ background: '#080c14', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid #1e293b' }}>
            <div style={{ color: '#f8fafc', fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.35rem', fontFamily: 'var(--font-heading)' }}>
              No Suspect Face Scanning
            </div>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.55 }}>
              KAVACH does not use facial recognition or profile suspects.
            </p>
          </div>

          <div style={{ background: '#080c14', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid #1e293b' }}>
            <div style={{ color: '#f8fafc', fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.35rem', fontFamily: 'var(--font-heading)' }}>
              Human Officer Decisions
            </div>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.55 }}>
              The software suggests leads, but the human officer always makes the final decisions.
            </p>
          </div>

        </div>
      </section>

      {/* Bottom Call to Action Section */}
      <section style={{ 
        background: 'linear-gradient(180deg, #0f172a 0%, #080c14 100%)', 
        border: '1px solid #1e293b', 
        borderRadius: 'var(--radius-lg)', 
        padding: '3rem 2rem', 
        textAlign: 'center' 
      }}>
        <h2 style={{ 
          fontFamily: 'var(--font-display)', 
          fontSize: '1.85rem', 
          fontWeight: 700, 
          color: '#f8fafc',
          marginBottom: '0.75rem' 
        }}>
          Ready to Explore KAVACH?
        </h2>

        <p style={{ 
          color: '#94a3b8', 
          fontSize: '1rem', 
          maxWidth: '620px', 
          margin: '0 auto 2rem auto', 
          lineHeight: 1.65 
        }}>
          Open the workstation to test case search, clue extraction, and evidence checklists across 10,000+ past police records.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Link to="/dashboard" className="btn-primary" style={{ padding: '0.85rem 1.75rem', fontSize: '1rem' }}>
            Launch Workstation <ArrowRight size={18} />
          </Link>
        </div>
      </section>

    </div>
  );
}
