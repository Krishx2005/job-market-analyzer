import os
import pandas as pd
from database import get_connection
from config import EXPORT_DIR


TABLES = ["jobs", "skills_stats", "salary_stats", "work_type_stats", "company_stats", "demand_stats"]


def export_all_csv():
    os.makedirs(EXPORT_DIR, exist_ok=True)
    conn = get_connection()
    for table in TABLES:
        df = pd.read_sql_query(f"SELECT * FROM {table}", conn)
        path = os.path.join(EXPORT_DIR, f"{table}.csv")
        df.to_csv(path, index=False)
        print(f"Exported {table} -> {path} ({len(df)} rows)")
    conn.close()
    print("CSV export complete.")


if __name__ == "__main__":
    export_all_csv()
