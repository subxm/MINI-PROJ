from fastapi import APIRouter, Query
from typing import Optional
from app.schemas.cases import PaginatedHistoricalCases
from app.db.database import db_manager
from scripts.import_sfpd_csv import import_sfpd_csv_file

router = APIRouter(prefix="/historical-cases", tags=["Historical Records"])

@router.get("", response_model=PaginatedHistoricalCases)
def search_historical_cases(
    query: Optional[str] = Query(None, description="Keyword search in incident description"),
    category: Optional[str] = Query(None, description="Filter by crime category"),
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100)
):
    res = db_manager.search_historical_cases(query=query, category=category, page=page, limit=limit)
    return PaginatedHistoricalCases(**res)

@router.post("/import-sample")
def trigger_sample_import():
    """Import built-in SFPD sample CSV dataset fixture."""
    result = import_sfpd_csv_file()
    return result
