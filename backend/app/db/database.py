import os
import sqlite3
import uuid
from datetime import datetime
from typing import List, Dict, Any, Optional
from app.config import settings

class DatabaseManager:
    def __init__(self):
        self.use_supabase = False
        self.supabase_client = None
        self.db_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "data", "kavach.db")
        
        # Try initializing Supabase if keys exist
        if settings.SUPABASE_URL and settings.SUPABASE_KEY and "your-supabase" not in settings.SUPABASE_URL and len(settings.SUPABASE_URL) > 10:
            try:
                from supabase import create_client
                self.supabase_client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
                # Test connection
                self.supabase_client.table("historical_cases").select("id").limit(1).execute()
                self.use_supabase = True
                print("Connected to Supabase PostgreSQL database successfully.")
            except Exception as e:
                print(f"Supabase connection notice: {e}. Using SQLite local database fallback.")
                self.use_supabase = False

        if not self.use_supabase:
            os.makedirs(os.path.dirname(self.db_path), exist_ok=True)
            self._init_sqlite()

    def _init_sqlite(self):
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS historical_cases (
            id TEXT PRIMARY KEY,
            source TEXT NOT NULL DEFAULT 'SFPD_PUBLIC',
            source_incident_id TEXT UNIQUE,
            incident_datetime TEXT,
            crime_category TEXT,
            crime_subcategory TEXT,
            incident_description TEXT,
            resolution TEXT,
            neighborhood TEXT,
            latitude REAL,
            longitude REAL,
            created_at TEXT DEFAULT (datetime('now'))
        );
        """)

        cursor.execute("""
        CREATE TABLE IF NOT EXISTS demo_cases (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            incident_description TEXT NOT NULL,
            crime_category TEXT,
            crime_subcategory TEXT,
            incident_datetime TEXT,
            neighborhood TEXT,
            source TEXT NOT NULL DEFAULT 'DEMO_USER',
            created_at TEXT DEFAULT (datetime('now'))
        );
        """)

        conn.commit()
        conn.close()

    def get_backend_name(self) -> str:
        return "Supabase PostgreSQL" if self.use_supabase else "SQLite Local"

    # --- Historical Cases ---
    def get_historical_cases_count(self) -> int:
        if self.use_supabase:
            res = self.supabase_client.table("historical_cases").select("id", count="exact").execute()
            return res.count or 0
        else:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            cursor.execute("SELECT COUNT(*) FROM historical_cases")
            count = cursor.fetchone()[0]
            conn.close()
            return count

    def get_all_historical_cases(self) -> List[Dict[str, Any]]:
        if self.use_supabase:
            res = self.supabase_client.table("historical_cases").select("*").execute()
            return res.data or []
        else:
            conn = sqlite3.connect(self.db_path)
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM historical_cases")
            rows = cursor.fetchall()
            conn.close()
            return [dict(r) for r in rows]

    def insert_historical_cases_batch(self, cases: List[Dict[str, Any]]) -> int:
        if not cases:
            return 0
        
        inserted_count = 0
        if self.use_supabase:
            # Upsert into supabase
            res = self.supabase_client.table("historical_cases").upsert(cases, on_conflict="source_incident_id").execute()
            inserted_count = len(res.data) if res.data else len(cases)
        else:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            for c in cases:
                if "id" not in c or not c["id"]:
                    c["id"] = str(uuid.uuid4())
                cursor.execute("""
                INSERT INTO historical_cases (
                    id, source, source_incident_id, incident_datetime, crime_category,
                    crime_subcategory, incident_description, resolution, neighborhood,
                    latitude, longitude, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON CONFLICT(source_incident_id) DO UPDATE SET
                    incident_datetime=excluded.incident_datetime,
                    crime_category=excluded.crime_category,
                    crime_subcategory=excluded.crime_subcategory,
                    incident_description=excluded.incident_description,
                    resolution=excluded.resolution,
                    neighborhood=excluded.neighborhood,
                    latitude=excluded.latitude,
                    longitude=excluded.longitude
                """, (
                    c["id"],
                    c.get("source", "SFPD_PUBLIC"),
                    c.get("source_incident_id"),
                    c.get("incident_datetime"),
                    c.get("crime_category"),
                    c.get("crime_subcategory"),
                    c.get("incident_description"),
                    c.get("resolution"),
                    c.get("neighborhood"),
                    c.get("latitude"),
                    c.get("longitude"),
                    c.get("created_at", datetime.utcnow().isoformat())
                ))
                inserted_count += 1
            conn.commit()
            conn.close()
        return inserted_count

    def search_historical_cases(
        self, query: Optional[str] = None, category: Optional[str] = None, page: int = 1, limit: int = 10
    ) -> Dict[str, Any]:
        offset = (page - 1) * limit
        if self.use_supabase:
            req = self.supabase_client.table("historical_cases").select("*", count="exact")
            if category and category.lower() != "all":
                req = req.ilike("crime_category", f"%{category}%")
            if query and query.strip():
                req = req.ilike("incident_description", f"%{query}%")
            
            res = req.range(offset, offset + limit - 1).execute()
            return {
                "items": res.data or [],
                "total": res.count or 0,
                "page": page,
                "limit": limit
            }
        else:
            conn = sqlite3.connect(self.db_path)
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()
            
            where_clauses = []
            params = []
            if category and category.lower() != "all":
                where_clauses.append("LOWER(crime_category) LIKE ?")
                params.append(f"%{category.lower()}%")
            if query and query.strip():
                where_clauses.append("LOWER(incident_description) LIKE ?")
                params.append(f"%{query.lower()}%")
                
            where_sql = (" WHERE " + " AND ".join(where_clauses)) if where_clauses else ""
            
            cursor.execute(f"SELECT COUNT(*) FROM historical_cases{where_sql}", params)
            total = cursor.fetchone()[0]
            
            cursor.execute(f"SELECT * FROM historical_cases{where_sql} ORDER BY created_at DESC LIMIT ? OFFSET ?", params + [limit, offset])
            rows = cursor.fetchall()
            conn.close()
            return {
                "items": [dict(r) for r in rows],
                "total": total,
                "page": page,
                "limit": limit
            }

    # --- Demo Cases ---
    def get_demo_cases_count(self) -> int:
        if self.use_supabase:
            res = self.supabase_client.table("demo_cases").select("id", count="exact").execute()
            return res.count or 0
        else:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            cursor.execute("SELECT COUNT(*) FROM demo_cases")
            count = cursor.fetchone()[0]
            conn.close()
            return count

    def create_demo_case(self, data: Dict[str, Any]) -> Dict[str, Any]:
        case_id = str(uuid.uuid4())
        created_at = datetime.utcnow().isoformat()
        record = {
            "id": case_id,
            "title": data["title"].strip(),
            "incident_description": data["incident_description"].strip(),
            "crime_category": data.get("crime_category", "Unknown"),
            "crime_subcategory": data.get("crime_subcategory"),
            "incident_datetime": data.get("incident_datetime"),
            "neighborhood": data.get("neighborhood"),
            "source": "DEMO_USER",
            "created_at": created_at
        }
        
        if self.use_supabase:
            res = self.supabase_client.table("demo_cases").insert(record).execute()
            return res.data[0] if res.data else record
        else:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            cursor.execute("""
            INSERT INTO demo_cases (id, title, incident_description, crime_category, crime_subcategory, incident_datetime, neighborhood, source, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                record["id"], record["title"], record["incident_description"],
                record["crime_category"], record["crime_subcategory"],
                record["incident_datetime"], record["neighborhood"],
                record["source"], record["created_at"]
            ))
            conn.commit()
            conn.close()
            return record

    def get_demo_cases(self) -> List[Dict[str, Any]]:
        if self.use_supabase:
            res = self.supabase_client.table("demo_cases").select("*").order("created_at", desc=True).execute()
            return res.data or []
        else:
            conn = sqlite3.connect(self.db_path)
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM demo_cases ORDER BY created_at DESC")
            rows = cursor.fetchall()
            conn.close()
            return [dict(r) for r in rows]

    def get_demo_case_by_id(self, case_id: str) -> Optional[Dict[str, Any]]:
        if self.use_supabase:
            res = self.supabase_client.table("demo_cases").select("*").eq("id", case_id).execute()
            return res.data[0] if res.data else None
        else:
            conn = sqlite3.connect(self.db_path)
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM demo_cases WHERE id = ?", (case_id,))
            row = cursor.fetchone()
            conn.close()
            return dict(row) if row else None

db_manager = DatabaseManager()
