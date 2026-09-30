<div align="center">

# 🛡️ KAVACH — Case Intelligence & Incident Retrieval Workstation

**AI-Assisted Historical Crime Search, Similarity Retrieval & Actionable Lead Analysis System**

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI_0.100+-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/Frontend-React_18-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Build-Vite_8-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Database-Supabase_PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Scikit-Learn](https://img.shields.io/badge/AI/NLP-Scikit--Learn-F7931E?style=for-the-badge&logo=scikit-learn)](https://scikit-learn.org/)

</div>

---

## 📌 Executive Summary

**KAVACH** is an explainable, NLP-assisted historical incident retrieval workstation designed to help investigators record new incidents, cross-evaluate 10,000+ public SFPD crime records using hybrid TF-IDF text vectors, extract target entities, and generate actionable evidence lead checklists for law enforcement case analysis.

> ⚠️ **Educational Prototype Notice:** KAVACH is built for academic and educational demonstration using public San Francisco Police Department (SFPD) incident data. Retrieval similarity percentages reflect text vector and structured attribute match scores — **never** probability of guilt or case connection.

---

## 🌟 Key Problem-Solving Features

- **🤖 Hybrid Vector & Attribute Search:** Combines TF-IDF narrative vector cosine similarity (70%) with normalized category (20%), subcategory (5%), and neighborhood (5%) signals.
- **🏷️ Extracted Entity & MO Matrix:** Automatically extracts stolen property (laptops, watches, cash), entry methods (forced rear window, door lock breach), and neighborhood clusters from incident text.
- **📋 Actionable Evidence Lead Checklist:** Generates an interactive investigator protocol checklist:
  - `[HIGH]` **Surveillance Canvass:** Request CCTV & traffic footage within 200m radius of the neighborhood.
  - `[HIGH]` **Marketplace Alert:** Flag regional pawn shops and marketplaces for extracted stolen items.
  - `[MEDIUM]` **Forensic Inspection:** Inspect point of entry for latent toolmark & fingerprint patterns.
- **📊 Historical Resolution Rate Analysis:** Analyzes clearance rates across past matching cases in the SFPD dataset (% Cleared by Arrest vs % Open).
- **📄 Printable Case Dossier Export:** 1-click export of formal, structured PDF/Printable Case Intelligence Dossiers for presentation slides and senior officer briefings.
- **☁️ Zero-Config Dual Database:** Runs out-of-the-box on SQLite (`backend/data/kavach.db`) and seamlessly connects to **Supabase PostgreSQL** via environment variables.

---

## 🛠️ Tech Stack & Architecture

```text
MINI PROJ/
├── backend/
│   ├── app/
│   │   ├── main.py                # FastAPI entry point & startup event
│   │   ├── config.py              # Environment settings & weights
│   │   ├── db/database.py         # Dual Supabase & SQLite database manager
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
│   │   ├── components/            # Navbar with React Router links
│   │   ├── pages/                 # Dashboard, CaseList, NewCase, CaseDetail, HistoricalExplorer
│   │   ├── services/api.js        # Backend API Client
│   │   ├── App.jsx                # Multi-page BrowserRouter routes
│   │   └── index.css              # Indigo/Violet slate dark design system
│   └── package.json
├── supabase/
│   └── schema.sql                 # PostgreSQL schema definition
├── .gitignore
├── .env.example
└── README.md
```

---

## 📐 Mathematical Similarity Model

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

## 🚀 Local Quickstart Guide

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
pip install -r requirements.txt

# Import 10,000 SFPD records (or use default fixture)
python scripts/import_sfpd_csv.py --limit 10000

# Start FastAPI server
python -m uvicorn app.main:app --port 8000 --reload
```
*API docs will be live at `http://localhost:8000/docs`.*

### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install npm dependencies
npm install

# Start Vite dev server
npm run dev
```
*Application will be live at `http://localhost:5173/`.*

---

## ☁️ Supabase Cloud Database Configuration

1. Create a project at [Supabase.com](https://supabase.com/).
2. Run `supabase/schema.sql` in the Supabase SQL Editor.
3. Update `.env` in the root folder:

```ini
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_anon_or_service_role_key
```

---

## 🌐 Deployment Options

### Frontend (Vercel / Netlify / Render Static Site)
- **Framework Preset:** Vite
- **Root Directory:** `frontend`
- **Build Command:** `npm run build`
- **Output Directory:** `dist`

### Backend (Render Web Service / Railway / Vercel Serverless)
- **Build Command:** `pip install -r backend/requirements.txt`
- **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port 8000`
- **Environment Variables:** Set `SUPABASE_URL` and `SUPABASE_KEY`.

---

<div align="center">
  <sub>KAVACH Educational Prototype — Created for Academic Presentation</sub>
</div>
