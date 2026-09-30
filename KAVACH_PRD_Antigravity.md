# KAVACH --- Product Requirements Document (PRD)

**Project:** KAVACH: AI-Assisted Crime Case Search & Investigation
Support System\
**Document status:** MVP implementation specification\
**Audience:** Antigravity coding agent and 4-person college project
team\
**Target delivery:** Working prototype in 1 week\
**Version:** 1.0

------------------------------------------------------------------------

## 1. Purpose of this document

This PRD is the single source of truth for building the KAVACH
college-project prototype. Follow this document over any earlier
brainstorming, chat messages, or assumptions.

Build only the MVP defined here. Do not add features merely because they
appeared in the original broad concept.

## 2. Product summary

KAVACH is a web application that helps a user record a new incident and
quickly retrieve historical public incident records with similar
characteristics. It ranks candidate records using text similarity and
selected structured attributes, then shows the reasons each result was
retrieved.

**One-sentence problem statement:** Investigators spend time manually
searching and comparing historical crime records; KAVACH reduces that
effort by retrieving and explaining relevant historical incidents for a
newly entered case.

**Prototype limitation:** This is an educational demonstration using
public SFPD incident data and clearly labeled demo cases. It is not
connected to a police department and must not be represented as a
production law-enforcement system.

## 3. Goals

1.  Import a manageable sample of public historical incident data.
2.  Allow a user to create and view a new demo case.
3.  Find and rank similar historical incidents on demand.
4.  Explain the similarity result using visible text and
    structured-field matches.
5.  Provide a simple interface that can be demonstrated end-to-end.

## 4. Non-goals (explicitly out of scope)

Do **not** implement: - Crime prediction, hotspot forecasting,
predictive policing, or risk scores. - Suspect identification, face
recognition, criminal profiling, or guilt/innocence inference. - CCTV,
IoT, dispatch, live police-feed, or CCTNS integration. -
Criminal-network/link analysis or graph databases. - Automated
investigative recommendations or claims about what officers should do
next. - Generative-AI summaries or LLM integrations. - Mobile apps,
multi-agency deployment, complex roles/permissions, or enterprise audit
workflows. - Production security/compliance claims.

The app is "real-time" only in the limited sense that a user can submit
a case and receive a similarity search immediately/on demand. It does
not process live crime feeds.

## 5. Target user and primary workflow

**Primary prototype user:** A project demonstrator acting as an
investigator.

**Main workflow:** 1. Open the dashboard. 2. Create a new demo case by
entering a title, incident description, crime category, and optional
structured fields. 3. Save the case. 4. Select "Find similar cases." 5.
View ranked historical records with similarity percentages and reasons.
6. Open a result to inspect the source fields.

The user---not the software---decides whether a historical record is
relevant.

## 6. Data source and data interpretation

### Primary dataset

Use the public **San Francisco Police Department Incident Reports: 2018
to Present** dataset from the San Francisco Open Data portal:

https://data.sfgov.org/Public-Safety/Police-Department-Incident-Reports-2018-to-Present/wg3w-h783

The dataset is structured incident data. Its `incident_description`
field is a standardized description associated with the incident code;
do not describe it as a full officer-written narrative or a complete
investigative report.

### Import strategy

-   Do not load the entire dataset for the one-week prototype.
-   Support importing a CSV sample, ideally 5,000--20,000 rows
    initially. If the team already has a smaller downloaded sample, use
    it.
-   Keep the importer configurable so the team can adjust the row limit.
-   Preserve the source incident identifier and source name.
-   Clean missing values and normalize column names.
-   Deduplicate by source incident identifier where available.
-   Do not invent missing data. Store missing values as null.
-   Keep a small local sample or fixture for development so the app can
    run without repeatedly downloading the public dataset.
-   Do not scrape private data or attempt to access police systems.

### Suggested source-to-app field mapping

Map only fields actually present in the downloaded CSV. Column names can
vary by dataset version; inspect the CSV header before implementing the
mapping.

  --------------------------------------------------------------------------
  Canonical KAVACH field   SFPD source field (if     Notes
                           present)                  
  ------------------------ ------------------------- -----------------------
  `source_incident_id`     `incident_id` or          Preserve as text to
                           `incident_number`         avoid formatting loss

  `incident_datetime`      `incident_datetime`       Parse if present

  `incident_date`          `incident_date`           Optional fallback

  `incident_time`          `incident_time`           Optional

  `crime_category`         `incident_category`       Structured category

  `crime_subcategory`      `incident_subcategory`    Optional

  `incident_description`   `incident_description`    Text used for TF-IDF

  `resolution`             `resolution`              Display only; not a
                                                     similarity signal by
                                                     default

  `neighborhood`           `analysis_neighborhood`   Optional

  `latitude` / `longitude` corresponding location    Optional; do not
                           fields                    require map
                                                     functionality

  `source`                 Set to `SFPD_PUBLIC`      Identifies imported
                                                     record
  --------------------------------------------------------------------------

If a listed source column is absent, skip it and continue. Do not
fabricate it.

## 7. Functional requirements

### FR-1: Dashboard

-   Show a concise app title and navigation to Dashboard, Cases, and New
    Case.
-   Show simple counts: imported historical records and user-created
    demo cases, if readily available.
-   Avoid charts unless they are trivial and useful.

### FR-2: Create demo case

Required fields: - Case title (short text) - Incident description
(text) - Crime category (text or select; allow "Unknown")

Optional fields: - Crime subcategory - Incident date/time -
Neighborhood/location - Premise type, only if the selected dataset or
user-entered demo form supports it

Validation: - Title and description are required. - Trim whitespace. -
Show clear validation errors. - Save the case to Supabase with
`source = DEMO_USER`. - Do not present a demo case as an official police
record.

### FR-3: Case list and details

-   List user-created demo cases.
-   Show title, category, created date, and source label.
-   Allow opening a case detail page or panel.
-   Allow viewing imported historical records through search/results;
    full historical case management is not required.

### FR-4: Historical search and similar-case retrieval

-   Similarity search runs when the user clicks a button on a saved demo
    case.
-   Return up to 5 results by default, configurable in backend (maximum
    10).
-   Exclude the current demo case from historical candidates.
-   Do not compare records across incompatible/missing fields in a way
    that silently boosts their score.
-   Return results in descending score order.
-   If there are no suitable candidates, show a helpful empty state
    rather than fabricated results.

### FR-5: Similarity method (MVP)

Use a transparent hybrid ranking method:

**A. Text similarity** - Use scikit-learn `TfidfVectorizer` on the
historical `incident_description` field. - Transform the new case
description with the same fitted vectorizer. - Compute cosine similarity
between the new-case vector and historical vectors. - Use a safe
fallback if the historical descriptions are empty or the vectorizer
cannot be fitted.

**B. Structured similarity** Use only fields present for both the new
case and a historical record. Suggested signals: - Crime category: exact
normalized match. - Crime subcategory: exact normalized match, when
available. - Neighborhood: exact normalized match, when available. -
Date/time: optional coarse time-of-day bucket only if reliable fields
are present.

Do not use latitude/longitude proximity in the MVP unless the team has
time and can test it. Do not use resolution/status as a similarity
feature by default because it may be misleading or unavailable for new
cases.

**C. Score calculation** - Make weights configurable in one backend
file. - Initial proposed weights when all signals are available: - Text
similarity: 70% - Crime category: 20% - Subcategory: 5% - Neighborhood:
5% - Renormalize weights over the signals available for a given pair, so
missing optional fields do not count as mismatches or silently distort
the score. - If text is available but structured fields are not,
text-only ranking is allowed. - Return the component scores and match
explanations separately from the final score. - Display the final score
as a percentage, rounded to an integer. - Label it "similarity" or
"retrieval score," never "probability," "risk," or "confidence that
cases are connected."

Important: TF-IDF + cosine similarity is an NLP-based
information-retrieval technique. Do not claim that it predicts crime,
proves a connection, or determines that two incidents were committed by
the same person.

### FR-6: Explain why a result was retrieved

For each result, show concise, factual reasons derived from the actual
comparison, for example: - "Description similarity: 0.78" - "Same crime
category" - "Same subcategory" - "Same neighborhood"

Only show reasons supported by available fields. Do not show a checkmark
for missing data. Do not generate speculative explanations.

### FR-7: Search/filter historical records

-   Provide a basic keyword search over imported incident descriptions
    and/or category.
-   Provide optional category filter if straightforward.
-   This is a simple fallback when similarity search is not appropriate.

### FR-8: Error and empty states

Handle: - No historical data imported. - No matching records. - Missing
description. - Supabase connection/configuration failure. - CSV import
failure or unexpected column names. Display actionable but non-technical
messages in the UI. Log technical details in the backend console during
development.

## 8. User interface requirements

Use a clean, restrained, responsive React interface.

Required screens: 1. **Dashboard:** counts and clear navigation. 2.
**Cases:** list of user-created demo cases. 3. **New Case:** form to
create a demo case. 4. **Case Detail / Similar Results:** case details,
"Find similar cases" action, ranked results, similarity reasons.

Each result card should show: - Historical incident identifier - Crime
category - Incident date/time, if available - Neighborhood, if
available - Similarity percentage - One or more actual match reasons - A
way to inspect available source details

Clearly distinguish **Historical SFPD record** from **Demo case** with
labels.

## 9. Technical architecture

### Frontend

-   React (use the existing project setup if present).
-   Call the FastAPI backend for application data and similarity search.
-   Keep API base URL in an environment variable.
-   Include loading, success, error, and empty states.

### Backend

-   Python + FastAPI.
-   Use Pydantic request/response models.
-   Separate routes, data access, and similarity logic into small
    modules.
-   Suggested endpoints:
    -   `GET /health` --- health check.
    -   `GET /cases` --- list demo cases.
    -   `POST /cases` --- create a demo case.
    -   `GET /cases/{case_id}` --- retrieve one demo case.
    -   `POST /cases/{case_id}/similar` --- retrieve ranked historical
        cases.
    -   `GET /historical-cases` --- keyword/category search with
        pagination.
-   Add CORS for the local React development origin.
-   Never expose the Supabase service-role key to the frontend.

### Database

Use Supabase PostgreSQL.

Suggested tables:

**`historical_cases`** - `id` UUID primary key - `source` text not null
(default `SFPD_PUBLIC`) - `source_incident_id` text unique where
available - `incident_datetime` timestamptz nullable - `crime_category`
text nullable - `crime_subcategory` text nullable -
`incident_description` text nullable - `resolution` text nullable -
`neighborhood` text nullable - `latitude` double precision nullable -
`longitude` double precision nullable - `raw_data` jsonb nullable
(optional; omit if it complicates import) - `created_at` timestamptz
default now()

**`demo_cases`** - `id` UUID primary key - `title` text not null -
`incident_description` text not null - `crime_category` text nullable -
`crime_subcategory` text nullable - `incident_datetime` timestamptz
nullable - `neighborhood` text nullable - `created_at` timestamptz
default now() - `source` text not null default `DEMO_USER`

Use migrations or provide a single SQL schema file. Add indexes on
fields used for filtering. Keep database setup instructions in README.

### Similarity implementation and performance

-   For the prototype, load a bounded historical sample and fit/cache
    the TF-IDF vectorizer and document matrix in the backend.
-   Avoid fitting the vectorizer from scratch for every request.
-   If data is small, in-memory cosine similarity is acceptable.
-   Keep the implementation simple and deterministic.
-   Do not introduce a vector database, embeddings API, deep-learning
    model, or external LLM.

## 10. Data ingestion

Provide a repeatable Python script, for example
`backend/scripts/import_sfpd_csv.py`, that: 1. Reads a local CSV path
supplied by command-line argument or environment variable. 2. Inspects
and maps known source columns. 3. Selects only supported columns. 4.
Cleans strings and parses dates safely. 5. Drops rows without a usable
source ID only if required for deduplication; otherwise preserve them
with a generated local ID. 6. Imports in batches to Supabase. 7. Reports
rows read, accepted, skipped, and failed. 8. Is safe to rerun without
creating duplicate historical records where source IDs exist.

Do not make the application depend on downloading the dataset at
runtime. Document where the team obtains the CSV and how to run the
import script.

## 11. API behavior

### `POST /cases/{case_id}/similar`

Request: - `top_k` optional integer, default 5, range 1--10.

Response for each result should include: - historical record ID - source
incident ID - crime category/subcategory - incident description -
incident datetime - neighborhood - final similarity score (0--1) - text
similarity (0--1 or null) - structured match details (field, match
boolean, contribution/score)

The API must not return a claim that a result is a confirmed related
case. Use wording such as "similar historical incident."

## 12. Non-functional requirements

-   **Usability:** A first-time demonstrator should be able to create a
    case and retrieve results without reading technical documentation.
-   **Performance:** For the bounded prototype dataset, similarity
    results should appear within a few seconds on a typical development
    laptop; do not promise a hard SLA.
-   **Reliability:** Missing optional dataset columns must not crash the
    importer or similarity search.
-   **Maintainability:** Keep the project small and readable; avoid
    unnecessary abstractions.
-   **Privacy:** Use public historical data and fictional/demo entries
    only. Do not enter real personal or sensitive case information.
-   **Transparency:** Display source labels and explain the similarity
    factors.
-   **Security:** Keep credentials in environment variables; do not
    commit `.env` files.

## 13. Acceptance criteria

The MVP is complete when all of the following work:

1.  The project starts locally using documented commands.
2.  The backend health endpoint responds successfully.
3.  The Supabase schema can be applied using the README instructions.
4.  The import script can load a small SFPD CSV sample and report its
    results.
5.  Imported historical records appear in the app or are retrievable
    through the API.
6.  A user can create a demo case with a title and description.
7.  The saved demo case remains available after page refresh.
8.  Clicking "Find similar cases" returns up to five historical records,
    ranked by score.
9.  Each result displays its score and only valid, data-supported match
    explanations.
10. The app handles empty data and API/database errors without crashing.
11. The UI clearly labels historical records and demo cases.
12. The README explains setup, environment variables, data import, and
    known limitations.

## 14. One-week implementation plan

**Day 1 --- Foundation** - Inspect repository and preserve existing
working setup. - Create React and FastAPI skeletons. - Configure
Supabase and schema. - Add `/health`.

**Day 2 --- Data** - Download a small SFPD CSV sample. - Inspect actual
headers and example values. - Implement and test CSV mapping/import. -
Confirm rows appear in Supabase.

**Day 3 --- Case CRUD** - Implement create/list/detail endpoints for
demo cases. - Build the corresponding React pages/forms.

**Day 4 --- Similarity** - Implement TF-IDF and cosine similarity. - Add
structured-field matching and score explanations. - Test with several
known example inputs.

**Day 5 --- Results UI** - Build ranked similar-case cards and
details. - Add loading, empty, and error states. - Add basic historical
search.

**Day 6 --- Integration and testing** - Test the full workflow from case
creation to similar-case retrieval. - Fix integration and data issues. -
Verify no secrets are exposed.

**Day 7 --- Stabilization and demo** - Freeze scope. - Prepare README
and demo data. - Rehearse a short end-to-end demonstration. - Capture
screenshots for the PPT.

If time is short, prioritize in this order: 1. Import historical data.
2. Create demo case. 3. Similarity endpoint. 4. Results UI with
explanations. 5. Dashboard polish and optional filters.

## 15. Demo scenario

Use a fictional demo case, clearly labeled as fictional:

**Title:** Residential burglary --- demo\
**Description:** "A laptop was reported stolen from a residence during
the evening."

Demonstrate: 1. Create and save the case. 2. Click "Find similar cases."
3. Show the top historical incident matches. 4. Explain the score using
actual available fields. 5. Open one historical result and show its
source data. 6. State that similarity is a retrieval aid, not evidence
of a connection.

Do not hardcode a desired similarity score or promise that this exact
text will return a particular incident. Results depend on the imported
sample.

## 16. Risks and mitigations

  -----------------------------------------------------------------------
  Risk                                Mitigation
  ----------------------------------- -----------------------------------
  SFPD descriptions are short or      Inspect real sample values first;
  standardized                        use structured fields as additional
                                      signals and describe the feature as
                                      incident retrieval

  Dataset columns change              Use a configurable column mapping
                                      and skip absent optional fields

  Dataset is too large                Import a bounded sample; cache
                                      TF-IDF vectors

  New demo cases lack fields present  Renormalize weights over available
  in historical records               fields and disclose missing
                                      attributes

  Similarity score is misinterpreted  Label it a similarity score, show
                                      contributing factors, and state
                                      that it does not establish a
                                      connection

  One-week schedule is tight          Keep scope frozen and prioritize
                                      the end-to-end workflow
  -----------------------------------------------------------------------

## 17. Required project structure (suggested)

``` text
kavach/
  frontend/
    src/
      pages/
      components/
      services/
  backend/
    app/
      main.py
      routes/
      schemas/
      services/
        similarity.py
      db/
    scripts/
      import_sfpd_csv.py
    requirements.txt
  supabase/
    schema.sql
  .env.example
  README.md
```

The coding agent may adapt this to the repository's existing structure,
but should preserve the separation between frontend, API, data access,
and similarity logic.

## 18. Instructions to the Antigravity coding agent

1.  Treat this PRD as the authoritative project specification.
2.  First inspect the existing repository and report its current
    structure before making destructive changes.
3.  Implement the smallest complete end-to-end MVP.
4.  Do not add out-of-scope features or change the project into a
    predictive-policing system.
5.  Do not assume the dataset has fields that are not present in the
    downloaded CSV. Inspect headers and sample rows.
6.  Do not fabricate historical records, incident narratives, similarity
    results, or police integrations.
7.  If the dataset is unavailable during development, use clearly
    labeled fictional fixtures only for UI/testing, and keep the import
    path ready for the real CSV.
8.  Use environment variables for Supabase URL and keys. Keep
    service-role credentials server-side only.
9.  Provide clear setup instructions and a concise summary of
    implemented features, files changed, and remaining limitations.
10. If a requirement is ambiguous, prefer the simplest implementation
    consistent with this PRD rather than expanding scope.

------------------------------------------------------------------------

**Final product definition:** KAVACH is a small, explainable,
NLP-assisted historical incident retrieval prototype. It helps a user
find and inspect similar public incident records when entering a new
demo case. It does not predict crime or solve cases autonomously.
