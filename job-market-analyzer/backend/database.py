import sqlite3
import json
from pathlib import Path
from config import DATABASE_PATH


def get_connection():
    Path(DATABASE_PATH).parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_connection()
    c = conn.cursor()
    c.executescript("""
        CREATE TABLE IF NOT EXISTS jobs (
            id TEXT PRIMARY KEY,
            title TEXT,
            company TEXT,
            location TEXT,
            salary_min REAL,
            salary_max REAL,
            skills TEXT,
            experience_level TEXT,
            work_type TEXT,
            date_posted TEXT,
            source_url TEXT,
            role_type TEXT,
            description TEXT
        );

        CREATE TABLE IF NOT EXISTS skills_stats (
            skill TEXT PRIMARY KEY,
            count INTEGER,
            role_type TEXT
        );

        CREATE TABLE IF NOT EXISTS salary_stats (
            group_key TEXT PRIMARY KEY,
            group_type TEXT,
            group_value TEXT,
            avg_salary REAL,
            min_salary REAL,
            max_salary REAL,
            count INTEGER
        );

        CREATE TABLE IF NOT EXISTS work_type_stats (
            work_type TEXT PRIMARY KEY,
            count INTEGER
        );

        CREATE TABLE IF NOT EXISTS company_stats (
            company TEXT PRIMARY KEY,
            count INTEGER
        );

        CREATE TABLE IF NOT EXISTS demand_stats (
            experience_level TEXT PRIMARY KEY,
            count INTEGER
        );
    """)
    conn.commit()
    conn.close()


def insert_jobs(jobs):
    conn = get_connection()
    c = conn.cursor()
    for job in jobs:
        c.execute("""
            INSERT OR REPLACE INTO jobs
            (id, title, company, location, salary_min, salary_max, skills,
             experience_level, work_type, date_posted, source_url, role_type, description)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            job["id"], job["title"], job["company"], job["location"],
            job.get("salary_min"), job.get("salary_max"),
            json.dumps(job.get("skills", [])),
            job.get("experience_level", "unknown"),
            job.get("work_type", "unknown"),
            job.get("date_posted"), job.get("source_url"),
            job.get("role_type", "unknown"),
            job.get("description", ""),
        ))
    conn.commit()
    conn.close()


def get_all_jobs(filters=None, page=1, per_page=50):
    conn = get_connection()
    c = conn.cursor()
    query = "SELECT * FROM jobs WHERE 1=1"
    params = []
    if filters:
        if filters.get("role_type"):
            query += " AND role_type = ?"
            params.append(filters["role_type"])
        if filters.get("location"):
            query += " AND location LIKE ?"
            params.append(f"%{filters['location']}%")
        if filters.get("experience_level"):
            query += " AND experience_level = ?"
            params.append(filters["experience_level"])
    query += " ORDER BY date_posted DESC LIMIT ? OFFSET ?"
    params.extend([per_page, (page - 1) * per_page])
    rows = c.execute(query, params).fetchall()
    total = c.execute("SELECT COUNT(*) FROM jobs" +
                      query.split("ORDER BY")[0].replace("SELECT * FROM jobs", ""),
                      params[:-2]).fetchone()[0]
    conn.close()
    return [dict(r) for r in rows], total


def get_stats(table):
    conn = get_connection()
    rows = conn.execute(f"SELECT * FROM {table}").fetchall()
    conn.close()
    return [dict(r) for r in rows]


def write_stats(table, rows, columns):
    conn = get_connection()
    c = conn.cursor()
    c.execute(f"DELETE FROM {table}")
    placeholders = ", ".join(["?"] * len(columns))
    col_names = ", ".join(columns)
    for row in rows:
        c.execute(f"INSERT INTO {table} ({col_names}) VALUES ({placeholders})",
                  [row[col] for col in columns])
    conn.commit()
    conn.close()


if __name__ == "__main__":
    init_db()
    print("Database initialized.")
