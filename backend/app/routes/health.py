from fastapi import APIRouter
from app.schemas.cases import HealthResponse
from app.db.database import db_manager

router = APIRouter(tags=["Health"])

@router.get("/health", response_model=HealthResponse)
def get_health():
    historical_count = db_manager.get_historical_cases_count()
    demo_count = db_manager.get_demo_cases_count()
    backend_type = db_manager.get_backend_name()
    return HealthResponse(
        status="healthy",
        historical_records_count=historical_count,
        demo_cases_count=demo_count,
        database_backend=backend_type
    )
