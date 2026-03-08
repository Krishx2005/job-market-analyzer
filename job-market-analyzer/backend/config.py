import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parent.parent / ".env")

RAPIDAPI_KEY = os.getenv("RAPIDAPI_KEY", "")
JSEARCH_BASE_URL = "https://jsearch.p.rapidapi.com/search"
JSEARCH_HEADERS = {
    "X-RapidAPI-Key": RAPIDAPI_KEY,
    "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
}

SEARCH_QUERIES = ["Data Analyst", "Data Scientist"]
RESULTS_PER_QUERY = 50

PROJECT_ROOT = Path(__file__).resolve().parent.parent
DATABASE_PATH = os.getenv("DATABASE_PATH", str(PROJECT_ROOT / "data" / "jobs.db"))
EXPORT_DIR = os.getenv("EXPORT_DIR", str(PROJECT_ROOT / "exports"))

# Ensure database directory exists
Path(DATABASE_PATH).parent.mkdir(parents=True, exist_ok=True)

SKILLS_LIST = [
    "Python", "SQL", "R", "Tableau", "Power BI", "Excel", "SAS", "SPSS",
    "Spark", "Hadoop", "AWS", "Azure", "GCP", "Snowflake", "Databricks",
    "TensorFlow", "PyTorch", "Scikit-learn", "Pandas", "NumPy",
    "Machine Learning", "Deep Learning", "NLP", "Computer Vision",
    "Statistics", "A/B Testing", "ETL", "Data Warehousing",
    "Looker", "Qlik", "Airflow", "dbt", "Git", "Docker", "Kubernetes",
    "Java", "Scala", "JavaScript", "NoSQL", "MongoDB", "PostgreSQL",
    "MySQL", "Redshift", "BigQuery", "Kafka", "Matplotlib", "Seaborn",
]

EXPERIENCE_KEYWORDS = {
    "entry": ["entry level", "junior", "associate", "intern", "0-2 years", "new grad", "early career"],
    "mid": ["mid level", "mid-level", "3-5 years", "2-5 years", "3+ years"],
    "senior": ["senior", "lead", "principal", "staff", "manager", "director", "5+ years", "7+ years", "10+ years"],
}

WORK_TYPE_KEYWORDS = {
    "remote": ["remote", "work from home", "wfh", "telecommute", "distributed"],
    "hybrid": ["hybrid", "flexible location", "partly remote"],
    "onsite": ["onsite", "on-site", "in-office", "in office", "on site"],
}
