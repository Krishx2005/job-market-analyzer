import json
import pandas as pd
from database import get_connection, write_stats


def load_jobs_df():
    conn = get_connection()
    df = pd.read_sql_query("SELECT * FROM jobs", conn)
    conn.close()
    df["skills_list"] = df["skills"].apply(lambda x: json.loads(x) if x else [])
    return df


def compute_skills_stats(df):
    rows = []
    for _, row in df.iterrows():
        for skill in row["skills_list"]:
            rows.append({"skill": skill, "role_type": row.get("role_type", "unknown")})
    if not rows:
        return []
    skills_df = pd.DataFrame(rows)
    result = skills_df.groupby("skill").agg(
        count=("skill", "size"),
        role_type=("role_type", lambda x: x.mode().iloc[0] if len(x) > 0 else "unknown"),
    ).reset_index().sort_values("count", ascending=False)
    return result.to_dict("records")


def compute_salary_stats(df):
    df_sal = df.dropna(subset=["salary_min", "salary_max"]).copy()
    df_sal["avg_salary"] = (df_sal["salary_min"] + df_sal["salary_max"]) / 2
    results = []

    for group_type, col in [("role", "role_type"), ("location", "location"), ("experience", "experience_level")]:
        grouped = df_sal.groupby(col).agg(
            avg_salary=("avg_salary", "mean"),
            min_salary=("salary_min", "min"),
            max_salary=("salary_max", "max"),
            count=("avg_salary", "size"),
        ).reset_index()
        if group_type == "location":
            grouped = grouped.nlargest(15, "count")
        for _, row in grouped.iterrows():
            results.append({
                "group_key": f"{group_type}_{row[col]}",
                "group_type": group_type,
                "group_value": row[col],
                "avg_salary": round(row["avg_salary"], 2),
                "min_salary": round(row["min_salary"], 2),
                "max_salary": round(row["max_salary"], 2),
                "count": int(row["count"]),
            })
    return results


def compute_work_type_stats(df):
    counts = df["work_type"].value_counts().reset_index()
    counts.columns = ["work_type", "count"]
    return counts.to_dict("records")


def compute_company_stats(df):
    counts = df["company"].value_counts().head(20).reset_index()
    counts.columns = ["company", "count"]
    return counts.to_dict("records")


def compute_demand_stats(df):
    counts = df["experience_level"].value_counts().reset_index()
    counts.columns = ["experience_level", "count"]
    return counts.to_dict("records")


def run_pandas_processing():
    print("Running Pandas processing...")
    df = load_jobs_df()
    if df.empty:
        print("No jobs to process.")
        return

    skills = compute_skills_stats(df)
    write_stats("skills_stats", skills, ["skill", "count", "role_type"])

    salary = compute_salary_stats(df)
    write_stats("salary_stats", salary,
                ["group_key", "group_type", "group_value", "avg_salary", "min_salary", "max_salary", "count"])

    work_type = compute_work_type_stats(df)
    write_stats("work_type_stats", work_type, ["work_type", "count"])

    companies = compute_company_stats(df)
    write_stats("company_stats", companies, ["company", "count"])

    demand = compute_demand_stats(df)
    write_stats("demand_stats", demand, ["experience_level", "count"])

    print("Pandas processing complete.")


if __name__ == "__main__":
    run_pandas_processing()
