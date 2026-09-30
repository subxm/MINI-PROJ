from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from app.schemas.cases import (
    DemoCase, DemoCaseCreate, SimilarCaseRequest, SimilarCaseResponse, SimilarCaseResult
)
from app.db.database import db_manager
from app.services.similarity import similarity_engine
from app.services.intelligence import intelligence_service

router = APIRouter(prefix="/cases", tags=["Demo Cases"])

@router.get("", response_model=List[DemoCase])
def list_demo_cases():
    cases = db_manager.get_demo_cases()
    return [DemoCase(**c) for c in cases]

@router.post("", response_model=DemoCase, status_code=201)
def create_demo_case(case_in: DemoCaseCreate):
    if not case_in.title.strip() or not case_in.incident_description.strip():
        raise HTTPException(status_code=400, detail="Title and incident description are required.")
    
    created = db_manager.create_demo_case(case_in.dict())
    return DemoCase(**created)

@router.get("/{case_id}", response_model=DemoCase)
def get_demo_case(case_id: str):
    case_data = db_manager.get_demo_case_by_id(case_id)
    if not case_data:
        raise HTTPException(status_code=404, detail="Demo case not found.")
    return DemoCase(**case_data)

@router.post("/{case_id}/similar", response_model=SimilarCaseResponse)
def get_similar_historical_cases(case_id: str, request_body: Optional[SimilarCaseRequest] = None):
    top_k = request_body.top_k if request_body else 5
    top_k = max(1, min(10, top_k))  # PRD bound 1 to 10

    demo_case = db_manager.get_demo_case_by_id(case_id)
    if not demo_case:
        raise HTTPException(status_code=404, detail="Demo case not found.")

    historical_records = db_manager.get_all_historical_cases()
    if not historical_records:
        return SimilarCaseResponse(
            demo_case_id=case_id,
            demo_case_title=demo_case["title"],
            total_evaluated=0,
            top_k=top_k,
            results=[]
        )

    results = similarity_engine.find_similar_cases(
        demo_case=demo_case,
        historical_candidates=historical_records,
        top_k=top_k
    )

    return SimilarCaseResponse(
        demo_case_id=case_id,
        demo_case_title=demo_case["title"],
        total_evaluated=len(historical_records),
        top_k=top_k,
        results=results
    )

@router.get("/{case_id}/briefing")
def get_case_intelligence_briefing(case_id: str, top_k: int = 5):
    demo_case = db_manager.get_demo_case_by_id(case_id)
    if not demo_case:
        raise HTTPException(status_code=404, detail="Demo case not found.")

    historical_records = db_manager.get_all_historical_cases()
    results = similarity_engine.find_similar_cases(
        demo_case=demo_case,
        historical_candidates=historical_records,
        top_k=top_k
    )
    
    # Convert Pydantic results to dicts for intelligence service
    res_dicts = [r.dict() for r in results]
    brief = intelligence_service.generate_briefing(demo_case, res_dicts, len(historical_records))
    return brief

