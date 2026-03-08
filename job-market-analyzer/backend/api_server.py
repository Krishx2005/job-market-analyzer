#!/usr/bin/env python3
"""FastAPI server providing analytics endpoints for the frontend."""
import json
import subprocess
import sys
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from database import get_stats, get_all_jobs, get_connection, init_db

app = FastAPI(title="Job Market Analyzer API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup():
    init_db()


@app.get("/api/stats/skills")
def skills_stats(limit: int = Query(15, ge=1, le=50)):
    rows = get_stats("skills_stats")
    rows.sort(key=lambda x: x["count"], reverse=True)
    return rows[:limit]


@app.get("/api/stats/salary")
def salary_stats(group_type: str = Query(None)):
    rows = get_stats("salary_stats")
    if group_type:
        rows = [r for r in rows if r["group_type"] == group_type]
    return rows


@app.get("/api/stats/work-type")
def work_type_stats():
    return get_stats("work_type_stats")


@app.get("/api/stats/companies")
def company_stats(limit: int = Query(10, ge=1, le=30)):
    rows = get_stats("company_stats")
    rows.sort(key=lambda x: x["count"], reverse=True)
    return rows[:limit]


@app.get("/api/stats/demand")
def demand_stats():
    return get_stats("demand_stats")


@app.get("/api/stats/overview")
def overview():
    conn = get_connection()
    c = conn.cursor()
    total = c.execute("SELECT COUNT(*) FROM jobs").fetchone()[0]
    avg_sal = c.execute(
        "SELECT AVG((salary_min + salary_max) / 2) FROM jobs WHERE salary_min IS NOT NULL"
    ).fetchone()[0]
    companies = c.execute("SELECT COUNT(DISTINCT company) FROM jobs").fetchone()[0]
    locations = c.execute("SELECT COUNT(DISTINCT location) FROM jobs").fetchone()[0]
    conn.close()
    return {
        "total_jobs": total,
        "avg_salary": round(avg_sal, 2) if avg_sal else 0,
        "unique_companies": companies,
        "unique_locations": locations,
    }


@app.get("/api/jobs")
def list_jobs(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    role_type: str = Query(None),
    location: str = Query(None),
    experience_level: str = Query(None),
):
    filters = {}
    if role_type:
        filters["role_type"] = role_type
    if location:
        filters["location"] = location
    if experience_level:
        filters["experience_level"] = experience_level
    jobs, total = get_all_jobs(filters or None, page, per_page)
    for j in jobs:
        if j.get("skills"):
            j["skills"] = json.loads(j["skills"])
    return {"jobs": jobs, "total": total, "page": page, "per_page": per_page}


@app.post("/api/refresh")
def refresh_pipeline():
    try:
        result = subprocess.run(
            [sys.executable, "run_pipeline.py", "--export-csv"],
            capture_output=True, text=True, timeout=300,
        )
        return {"status": "success", "output": result.stdout[-1000:]}
    except Exception as e:
        return {"status": "error", "message": str(e)}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
