"""Seed the database with realistic mock job data for testing."""
import random
import json
from datetime import datetime, timedelta
from database import init_db, insert_jobs

COMPANIES = [
    "Google", "Amazon", "Meta", "Microsoft", "Apple", "Netflix", "Uber",
    "Airbnb", "Spotify", "Salesforce", "IBM", "Deloitte", "JPMorgan Chase",
    "Goldman Sachs", "Capital One", "Walmart", "Target", "Nike", "Tesla",
    "Accenture", "McKinsey", "BCG", "Palantir", "Snowflake", "Databricks",
    "Stripe", "Square", "Coinbase", "Lyft", "Twitter",
]

LOCATIONS = [
    "New York, NY", "San Francisco, CA", "Seattle, WA", "Austin, TX",
    "Chicago, IL", "Boston, MA", "Los Angeles, CA", "Denver, CO",
    "Atlanta, GA", "Dallas, TX", "Miami, FL", "Washington, DC",
    "Portland, OR", "San Jose, CA", "Raleigh, NC",
]

TITLES_ANALYST = [
    "Data Analyst", "Senior Data Analyst", "Junior Data Analyst",
    "Business Data Analyst", "Marketing Data Analyst", "Financial Data Analyst",
    "Data Analyst II", "Lead Data Analyst", "Entry Level Data Analyst",
    "Associate Data Analyst",
]

TITLES_SCIENTIST = [
    "Data Scientist", "Senior Data Scientist", "Junior Data Scientist",
    "Machine Learning Engineer", "ML Scientist", "Applied Data Scientist",
    "Data Scientist II", "Lead Data Scientist", "Entry Level Data Scientist",
    "Staff Data Scientist",
]

SKILL_POOLS = {
    "Data Analyst": ["SQL", "Excel", "Tableau", "Python", "Power BI", "R",
                     "Statistics", "Looker", "A/B Testing", "ETL", "Pandas",
                     "Data Warehousing", "BigQuery", "PostgreSQL", "Git"],
    "Data Scientist": ["Python", "SQL", "Machine Learning", "TensorFlow",
                       "PyTorch", "Scikit-learn", "Pandas", "NumPy", "R",
                       "Deep Learning", "NLP", "Statistics", "Spark", "AWS",
                       "Docker", "A/B Testing", "Computer Vision", "Git"],
}

SALARY_RANGES = {
    "entry": {"Data Analyst": (50000, 75000), "Data Scientist": (70000, 100000)},
    "mid": {"Data Analyst": (70000, 100000), "Data Scientist": (100000, 140000)},
    "senior": {"Data Analyst": (95000, 140000), "Data Scientist": (140000, 210000)},
}

EXPERIENCE_WEIGHTS = {"entry": 30, "mid": 45, "senior": 25}
WORK_TYPE_WEIGHTS = {"remote": 35, "hybrid": 40, "onsite": 25}


def detect_exp_from_title(title):
    t = title.lower()
    if any(k in t for k in ["junior", "entry", "associate"]):
        return "entry"
    if any(k in t for k in ["senior", "lead", "staff", "principal"]):
        return "senior"
    return "mid"


def generate_mock_jobs(count=200):
    jobs = []
    base_date = datetime.now()

    for i in range(count):
        role_type = random.choice(["Data Analyst", "Data Scientist"])
        titles = TITLES_ANALYST if role_type == "Data Analyst" else TITLES_SCIENTIST
        title = random.choice(titles)
        exp = detect_exp_from_title(title)
        company = random.choice(COMPANIES)
        location = random.choice(LOCATIONS)
        work_type = random.choices(
            list(WORK_TYPE_WEIGHTS.keys()),
            weights=list(WORK_TYPE_WEIGHTS.values()),
        )[0]

        sal_range = SALARY_RANGES[exp][role_type]
        salary_min = random.randint(sal_range[0], sal_range[0] + 15000)
        salary_max = random.randint(sal_range[1] - 10000, sal_range[1])

        skill_pool = SKILL_POOLS[role_type]
        num_skills = random.randint(4, 8)
        skills = random.sample(skill_pool, min(num_skills, len(skill_pool)))

        days_ago = random.randint(0, 30)
        date_posted = (base_date - timedelta(days=days_ago)).isoformat()

        jobs.append({
            "id": f"mock_{role_type.replace(' ', '_').lower()}_{i:04d}",
            "title": title,
            "company": company,
            "location": location,
            "salary_min": salary_min,
            "salary_max": salary_max,
            "skills": skills,
            "experience_level": exp,
            "work_type": work_type,
            "date_posted": date_posted,
            "source_url": f"https://example.com/jobs/{i}",
            "role_type": role_type,
            "description": f"{title} at {company} in {location}. {work_type.capitalize()} position.",
        })

    return jobs


if __name__ == "__main__":
    init_db()
    jobs = generate_mock_jobs(200)
    insert_jobs(jobs)
    print(f"Seeded {len(jobs)} mock jobs into database.")
