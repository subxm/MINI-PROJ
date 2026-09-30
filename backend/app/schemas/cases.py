from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class DemoCaseCreate(BaseModel):
    title: str = Field(..., min_length=2, description="Short title for the demo case")
    incident_description: str = Field(..., min_length=5, description="Detailed description of the incident")
    crime_category: str = Field(default="Unknown", description="Primary category of crime")
    crime_subcategory: Optional[str] = Field(default=None, description="Optional subcategory")
    incident_datetime: Optional[str] = Field(default=None, description="ISO datetime or date string")
    neighborhood: Optional[str] = Field(default=None, description="Neighborhood or area")

class DemoCase(BaseModel):
    id: str
    title: str
    incident_description: str
    crime_category: str
    crime_subcategory: Optional[str] = None
    incident_datetime: Optional[str] = None
    neighborhood: Optional[str] = None
    source: str = "DEMO_USER"
    created_at: str

class HistoricalCase(BaseModel):
    id: str
    source: str = "SFPD_PUBLIC"
    source_incident_id: Optional[str] = None
    incident_datetime: Optional[str] = None
    crime_category: Optional[str] = None
    crime_subcategory: Optional[str] = None
    incident_description: Optional[str] = None
    resolution: Optional[str] = None
    neighborhood: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    created_at: str

class MatchFactor(BaseModel):
    factor_name: str
    matched: bool
    explanation: str
    weight: float
    score: float

class SimilarCaseResult(BaseModel):
    historical_record_id: str
    source_incident_id: Optional[str] = None
    crime_category: Optional[str] = None
    crime_subcategory: Optional[str] = None
    incident_description: Optional[str] = None
    incident_datetime: Optional[str] = None
    neighborhood: Optional[str] = None
    resolution: Optional[str] = None
    similarity_score: int  # Rounded percentage e.g. 85
    raw_score: float  # 0.0 to 1.0
    text_similarity: Optional[float] = None
    match_reasons: List[str]
    match_factors: List[MatchFactor]
    source_label: str = "Historical SFPD Record"

class SimilarCaseRequest(BaseModel):
    top_k: int = Field(default=5, ge=1, le=10)

class SimilarCaseResponse(BaseModel):
    demo_case_id: str
    demo_case_title: str
    total_evaluated: int
    top_k: int
    results: List[SimilarCaseResult]

class HealthResponse(BaseModel):
    status: str
    historical_records_count: int
    demo_cases_count: int
    database_backend: str

class PaginatedHistoricalCases(BaseModel):
    items: List[HistoricalCase]
    total: int
    page: int
    limit: int
