# KAVACH - Crime Case Search and Investigation Support System

An AI-assisted historical crime search, similarity retrieval, and actionable lead analysis system built with FastAPI, React, and Supabase PostgreSQL.

---

## Overview

KAVACH is an explainable historical incident retrieval system designed to help investigators search crime narratives, cross-evaluate 10,000+ public San Francisco Police Department (SFPD) crime records using TF-IDF text similarity, extract key target entities, and generate actionable evidence lead checklists for law enforcement case analysis.

> **Educational Prototype Notice:** KAVACH is built for academic and educational demonstration using public San Francisco Police Department (SFPD) incident data. Retrieval similarity percentages reflect text vector and structured attribute match scores — never probability of guilt or case connection.

---

## System Capabilities

- **Hybrid Vector and Attribute Search:** Combines TF-IDF narrative text cosine similarity (70%) with category (20%), subcategory (5%), and neighborhood (5%) matches.
- **Extracted Entity and MO Matrix:** Automatically extracts stolen property (laptops, watches, cash), entry methods (forced rear window, door lock breach), and neighborhood clusters from incident text.
- **Actionable Evidence Lead Checklist:** Generates an interactive investigator protocol checklist including 200m CCTV canvassing, regional pawn shop alerts, and forensic toolmark inspection.
- **Visual Analytics Dashboard:** Interactive data visualizations showing crime category distributions, neighborhood density rankings, peak incident time windows, and lead performance metrics.
- **Printable Case Dossier Export:** One-click export of formal, structured Case Intelligence Dossiers for presentation slides and officer briefings.
- **Cloud Database Integration:** Connects seamlessly to Supabase PostgreSQL with zero-config local fallback support.

---

## System Architecture

```text
MINI PROJ/
├── backend/
│   ├── app/
│   │   ├── main.py                # FastAPI entry point
│   │   ├── config.py              # Environment settings and weights
│   │   ├── db/database.py         # Supabase & SQLite database manager
│   │   ├── schemas/cases.py       # Pydantic schemas
│   │   ├── services/
│   │   │   ├── similarity.py      # TF-IDF & Cosine Similarity engine
│   │   │   └── intelligence.py    # Entity extraction & Lead briefing generator
│   │   └── routes/                # Health, Cases, and Historical API routes
│   ├── data/
│   │   ├── sfpd_sample.csv        # SFPD dataset fixture
│   │   └── kavach.db              # SQLite local database
│   ├── scripts/
│   │   └── import_sfpd_csv.py     # Repeatable CSV importer script
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/            # Header and Navigation components
│   │   ├── pages/                 # LandingPage, Dashboard, CaseList, NewCase, CaseDetail, HistoricalExplorer
│   │   ├── services/api.js        # Backend API Client
│   │   ├── App.jsx                # Multi-page BrowserRouter routes
│   │   └── index.css              # Dark slate design system and animations
│   └── package.json
└── README.md
```

---

## Mathematical Similarity Model

KAVACH computes similarity scores using a weighted hybrid formula:

$$\text{Final Score} = \frac{\sum_{s \in \text{Available}} w_s \cdot \text{Score}_s}{\sum_{s \in \text{Available}} w_s}$$

| Factor Signal | Weight | Matching Methodology |
| :--- | :--- | :--- |
| **Narrative Vector** | **70%** | Scikit-Learn `TfidfVectorizer` (ngram 1-2) + Cosine Similarity |
| **Crime Category** | **20%** | Exact normalized category match (Burglary, Robbery, Larceny Theft) |
| **Subcategory** | **5%** | Exact normalized subcategory match when present |
| **Neighborhood** | **5%** | Exact normalized analysis neighborhood match |

*Note: Missing optional fields trigger dynamic weight renormalization so missing metadata never penalizes candidate scores.*

---

## Local Development Setup

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
pip install -r requirements.txt

# Start FastAPI server
python -m uvicorn app.main:app --port 8000 --reload
```
API documentation is available at `http://localhost:8000/docs`.

### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start Vite dev server
npm run dev
```
Application will be live at `http://localhost:5173/`.

---

## Cloud Database Configuration

1. Create a project at Supabase.com.
2. Run `supabase/schema.sql` in the Supabase SQL Editor.
3. Add the following to `.env` in the root folder:

```ini
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_anon_key
```

---

## Deployment Options

### Frontend (Vercel)
- **Framework Preset:** Vite
- **Root Directory:** `frontend`
- **Build Command:** `npm run build`
- **Output Directory:** `dist`

### Backend (Render)
- **Build Command:** `pip install -r backend/requirements.txt`
- **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port 8000`
- **Environment Variables:** Set `SUPABASE_URL` and `SUPABASE_KEY`.

---

KAVACH Educational Prototype — Built for Academic Demonstration.
