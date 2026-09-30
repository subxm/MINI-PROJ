-- KAVACH Supabase PostgreSQL Database Schema

-- Table for imported public historical crime incidents (SFPD)
CREATE TABLE IF NOT EXISTS historical_cases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source TEXT NOT NULL DEFAULT 'SFPD_PUBLIC',
    source_incident_id TEXT UNIQUE,
    incident_datetime TIMESTAMPTZ,
    crime_category TEXT,
    crime_subcategory TEXT,
    incident_description TEXT,
    resolution TEXT,
    neighborhood TEXT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table for user-submitted demo cases
CREATE TABLE IF NOT EXISTS demo_cases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    incident_description TEXT NOT NULL,
    crime_category TEXT,
    crime_subcategory TEXT,
    incident_datetime TIMESTAMPTZ,
    neighborhood TEXT,
    source TEXT NOT NULL DEFAULT 'DEMO_USER',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for efficient querying and search filters
CREATE INDEX IF NOT EXISTS idx_historical_crime_category ON historical_cases(crime_category);
CREATE INDEX IF NOT EXISTS idx_historical_neighborhood ON historical_cases(neighborhood);
CREATE INDEX IF NOT EXISTS idx_historical_source_id ON historical_cases(source_incident_id);
CREATE INDEX IF NOT EXISTS idx_demo_created_at ON demo_cases(created_at DESC);
