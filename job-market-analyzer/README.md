# Job Market Analyzer

Full-stack application that analyzes Data Analyst and Data Scientist job postings using the JSearch API, processes data with PySpark/Pandas, and displays insights on a React dashboard.

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  JSearch API │────>│   Python     │────>│   SQLite     │
│  (RapidAPI)  │     │  ETL Pipeline│     │   Database   │
└──────────────┘     └──────────────┘     └──────┬───────┘
                                                  │
                     ┌──────────────┐     ┌───────┴──────┐
                     │   React +    │<────│   FastAPI    │
                     │  Tailwind    │     │   Server     │
                     └──────────────┘     └───────┬──────┘
                                                  │
                     ┌──────────────┐             │
                     │  Power BI    │<── CSV ─────┘
                     │  Dashboard   │
                     └──────────────┘
```

## Tech Stack

- **Backend**: Python, FastAPI, PySpark, Pandas, SQLite
- **Frontend**: React 18, Vite, Tailwind CSS, Recharts
- **BI**: Power BI (CSV data source)
- **Scheduling**: Cron / Apache Airflow

## Setup

### Prerequisites
- Python 3.10+
- Node.js 18+
- RapidAPI key for [JSearch API](https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch)

### 1. Configure Environment
```bash
cp .env.example .env
# Edit .env and add your RAPIDAPI_KEY
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 3. Run the Pipeline
```bash
# Fetch jobs, process analytics, export CSVs
python run_pipeline.py --export-csv

# Use PySpark instead of Pandas
python run_pipeline.py --use-spark --export-csv

# Skip fetching, just reprocess existing data
python run_pipeline.py --skip-fetch --export-csv
```

### 4. Start the API Server
```bash
python api_server.py
# Server runs on http://localhost:8000
```

### 5. Frontend Setup
```bash
cd frontend
npm install
npm run dev
# App runs on http://localhost:5173
```

## API Endpoints

| Endpoint | Description |
|---|---|
| `GET /api/stats/overview` | Summary stats (total jobs, avg salary, etc.) |
| `GET /api/stats/skills?limit=15` | Top skills by frequency |
| `GET /api/stats/salary?group_type=role` | Average salary breakdowns |
| `GET /api/stats/work-type` | Remote/onsite/hybrid counts |
| `GET /api/stats/companies?limit=10` | Top hiring companies |
| `GET /api/stats/demand` | Entry/mid/senior level counts |
| `GET /api/jobs?page=1&role_type=Data+Analyst` | Paginated job listings |
| `POST /api/refresh` | Trigger pipeline manually |

## Power BI

1. Run the pipeline with `--export-csv` to generate CSV files in `exports/`
2. Open Power BI Desktop > Get Data > Text/CSV
3. Import CSV files from the `exports/` directory
4. See `powerbi/JobMarketAnalyzer.pbit.json` for suggested visuals

## Scheduling

### Cron (simple)
```bash
chmod +x cron_job.sh
# Add to crontab for daily 8 AM runs:
crontab -e
0 8 * * * /path/to/job-market-analyzer/cron_job.sh >> /path/to/cron.log 2>&1
```

### Airflow
Copy `backend/airflow_dag.py` to your Airflow `dags/` directory. The DAG runs daily at 8 AM.
