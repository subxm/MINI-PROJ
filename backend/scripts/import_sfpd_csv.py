import os
import sys
import csv
import uuid
import argparse
import pandas as pd
from datetime import datetime
from typing import Dict, Any, List

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.db.database import db_manager

COLUMN_MAPPINGS = {
    "source_incident_id": ["incident id", "incident_id", "incident number", "incident_number", "row id", "row_id"],
    "incident_datetime": ["incident datetime", "incident_datetime", "incident date time"],
    "incident_date": ["incident date", "incident_date"],
    "incident_time": ["incident time", "incident_time"],
    "crime_category": ["incident category", "incident_category", "crime category", "category"],
    "crime_subcategory": ["incident subcategory", "incident_subcategory", "crime subcategory", "subcategory"],
    "incident_description": ["incident description", "incident_description", "description"],
    "resolution": ["resolution", "incident resolution"],
    "neighborhood": ["analysis neighborhood", "analysis_neighborhood", "neighborhood", "district"],
    "latitude": ["latitude", "lat"],
    "longitude": ["longitude", "lon", "long"]
}

def map_row(row: Dict[str, Any], headers: List[str]) -> Dict[str, Any]:
    header_lower_map = {h.lower().strip(): h for h in headers}
    mapped = {}

    def get_val(possible_keys):
        for k in possible_keys:
            if k in header_lower_map:
                val = row.get(header_lower_map[k])
                if pd.notna(val) and val is not None:
                    sval = str(val).strip()
                    if sval and sval.lower() != "nan" and sval.lower() != "null":
                        return sval
        return None

    mapped["source_incident_id"] = get_val(COLUMN_MAPPINGS["source_incident_id"])
    mapped["crime_category"] = get_val(COLUMN_MAPPINGS["crime_category"]) or "Unknown"
    mapped["crime_subcategory"] = get_val(COLUMN_MAPPINGS["crime_subcategory"])
    mapped["incident_description"] = get_val(COLUMN_MAPPINGS["incident_description"])
    mapped["resolution"] = get_val(COLUMN_MAPPINGS["resolution"])
    mapped["neighborhood"] = get_val(COLUMN_MAPPINGS["neighborhood"])
    
    lat_str = get_val(COLUMN_MAPPINGS["latitude"])
    lon_str = get_val(COLUMN_MAPPINGS["longitude"])
    try:
        mapped["latitude"] = float(lat_str) if lat_str else None
    except (ValueError, TypeError):
        mapped["latitude"] = None
    try:
        mapped["longitude"] = float(lon_str) if lon_str else None
    except (ValueError, TypeError):
        mapped["longitude"] = None

    dt_str = get_val(COLUMN_MAPPINGS["incident_datetime"])
    if not dt_str:
        d_str = get_val(COLUMN_MAPPINGS["incident_date"])
        t_str = get_val(COLUMN_MAPPINGS["incident_time"]) or "00:00"
        if d_str:
            dt_str = f"{d_str} {t_str}"
    
    mapped["incident_datetime"] = dt_str
    mapped["source"] = "SFPD_PUBLIC"
    return mapped

def import_sfpd_csv_file(csv_path: str = None, limit_rows: int = 10000) -> Dict[str, Any]:
    if not csv_path:
        csv_path = os.getenv("SFPD_CSV_PATH")
    if not csv_path or not os.path.exists(csv_path):
        # Fallback to downloads or default sample fixture
        downloads_path = r"C:\Users\subham\Downloads\Police_Department_Incident_Reports__2018_to_Present_20260930.csv"
        if os.path.exists(downloads_path):
            csv_path = downloads_path
        else:
            csv_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data", "sfpd_sample.csv")

    print(f"Reading CSV file: {csv_path} (limit={limit_rows} rows)")
    if not os.path.exists(csv_path):
        return {"error": f"CSV file not found at {csv_path}", "imported": 0}

    chunk_size = 5000
    accepted_records = []
    skipped_count = 0
    read_count = 0
    seen_ids = set()

    for chunk in pd.read_csv(csv_path, dtype=str, chunksize=chunk_size, on_bad_lines="skip"):
        headers = list(chunk.columns)
        for _, row in chunk.iterrows():
            read_count += 1
            if limit_rows and len(accepted_records) >= limit_rows:
                break
                
            row_dict = row.to_dict()
            mapped = map_row(row_dict, headers)
            
            if not mapped.get("incident_description"):
                skipped_count += 1
                continue

            s_id = mapped.get("source_incident_id")
            if s_id:
                if s_id in seen_ids:
                    skipped_count += 1
                    continue
                seen_ids.add(s_id)
            else:
                mapped["source_incident_id"] = f"LOCAL_{uuid.uuid4().hex[:8]}"

            mapped["id"] = str(uuid.uuid4())
            accepted_records.append(mapped)

        if limit_rows and len(accepted_records) >= limit_rows:
            break

    print(f"Batch inserting {len(accepted_records)} records into database...")
    
    # Process batch insertion in chunks of 1000 to keep DB operations smooth
    batch_size = 1000
    total_inserted = 0
    for i in range(0, len(accepted_records), batch_size):
        sub_batch = accepted_records[i : i + batch_size]
        total_inserted += db_manager.insert_historical_cases_batch(sub_batch)

    report = {
        "status": "success",
        "csv_path": csv_path,
        "rows_read": read_count,
        "accepted": len(accepted_records),
        "inserted_or_updated": total_inserted,
        "skipped": skipped_count,
        "database_backend": db_manager.get_backend_name()
    }
    print(f"Import Summary: {report}")
    return report

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Import SFPD CSV Dataset")
    parser.add_argument("csv_path", nargs="?", help="Path to SFPD CSV dataset")
    parser.add_argument("--limit", type=int, default=10000, help="Maximum rows to import (default 10000)")
    args = parser.parse_args()
    
    import_sfpd_csv_file(args.csv_path, limit_rows=args.limit)
