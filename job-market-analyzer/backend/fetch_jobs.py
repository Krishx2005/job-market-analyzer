import re
import hashlib
import requests
from config import (
    JSEARCH_BASE_URL, JSEARCH_HEADERS, SEARCH_QUERIES,
    RESULTS_PER_QUERY, SKILLS_LIST, EXPERIENCE_KEYWORDS, WORK_TYPE_KEYWORDS,
)
from database import insert_jobs, init_db


def extract_skills(text):
    text_lower = text.lower()
    found = []
    for skill in SKILLS_LIST:
        pattern = r'\b' + re.escape(skill.lower()) + r'\b'
        if re.search(pattern, text_lower):
            found.append(skill)
    return found


def detect_experience_level(title, description):
    text = (title + " " + description).lower()
    for level, keywords in EXPERIENCE_KEYWORDS.items():
        for kw in keywords:
            if kw in text:
                return level
    return "mid"


def detect_work_type(title, description):
    text = (title + " " + description).lower()
    for wtype, keywords in WORK_TYPE_KEYWORDS.items():
        for kw in keywords:
            if kw in text:
                return wtype
    return "onsite"


def detect_role_type(query, title):
    text = (query + " " + title).lower()
    if "scientist" in text:
        return "Data Scientist"
    return "Data Analyst"


def fetch_jobs_from_api():
    all_jobs = []
    for query in SEARCH_QUERIES:
        print(f"Fetching: {query}")
        params = {
            "query": query,
            "page": "1",
            "num_pages": str(max(1, RESULTS_PER_QUERY // 10)),
            "country": "us",
            "date_posted": "month",
        }
        try:
            resp = requests.get(JSEARCH_BASE_URL, headers=JSEARCH_HEADERS, params=params, timeout=30)
            resp.raise_for_status()
            data = resp.json().get("data", [])
        except Exception as e:
            print(f"API error for '{query}': {e}")
            continue

        for item in data:
            desc = item.get("job_description", "") or ""
            title = item.get("job_title", "")
            job_id = item.get("job_id") or hashlib.md5(
                (title + item.get("employer_name", "")).encode()
            ).hexdigest()

            city = item.get("job_city", "") or ""
            state = item.get("job_state", "") or ""
            location = f"{city}, {state}".strip(", ") if city or state else "Unknown"

            job = {
                "id": job_id,
                "title": title,
                "company": item.get("employer_name", "Unknown"),
                "location": location,
                "salary_min": item.get("job_min_salary"),
                "salary_max": item.get("job_max_salary"),
                "skills": extract_skills(title + " " + desc),
                "experience_level": detect_experience_level(title, desc),
                "work_type": detect_work_type(title, desc),
                "date_posted": item.get("job_posted_at_datetime_utc", ""),
                "source_url": item.get("job_apply_link", ""),
                "role_type": detect_role_type(query, title),
                "description": desc[:2000],
            }
            all_jobs.append(job)

    print(f"Fetched {len(all_jobs)} jobs total.")
    return all_jobs


def run_fetch():
    init_db()
    jobs = fetch_jobs_from_api()
    if jobs:
        insert_jobs(jobs)
        print(f"Stored {len(jobs)} jobs in database.")
    return jobs


if __name__ == "__main__":
    run_fetch()
