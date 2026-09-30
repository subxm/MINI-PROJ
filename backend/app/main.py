import sys
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routes import health, cases, historical
from app.db.database import db_manager
from scripts.import_sfpd_csv import import_sfpd_csv_file

app = FastAPI(
    title="KAVACH API",
    description="AI-Assisted Crime Case Search & Historical Incident Retrieval System API",
    version="1.0.0"
)

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(health.router)
app.include_router(cases.router)
app.include_router(historical.router)

@app.on_event("startup")
def startup_event():
    print("Starting KAVACH Backend API...")
    # Check if historical cases DB is empty and seed default SFPD sample dataset if so
    count = db_manager.get_historical_cases_count()
    if count == 0:
        print("No historical cases found. Seeding sample SFPD dataset...")
        import_sfpd_csv_file()
    else:
        print(f"Loaded {count} existing historical cases from database.")

@app.get("/")
def root_index():
    return {
        "message": "Welcome to KAVACH API - AI-Assisted Case Search & Investigation Support",
        "docs": "/docs",
        "health": "/health"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=True)
