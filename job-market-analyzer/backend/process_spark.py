import json
from pyspark.sql import SparkSession
from pyspark.sql import functions as F
from pyspark.sql.types import ArrayType, StringType
from database import get_connection, write_stats


def get_spark():
    return SparkSession.builder \
        .appName("JobMarketAnalyzer") \
        .master("local[*]") \
        .config("spark.driver.memory", "2g") \
        .getOrCreate()


def load_jobs_spark(spark):
    conn = get_connection()
    import pandas as pd
    pdf = pd.read_sql_query("SELECT * FROM jobs", conn)
    conn.close()
    return spark.createDataFrame(pdf)


parse_skills = F.udf(lambda x: json.loads(x) if x else [], ArrayType(StringType()))


def compute_skills_stats(df):
    skills_df = df.select(
        F.explode(parse_skills(F.col("skills"))).alias("skill"),
        F.col("role_type"),
    )
    result = skills_df.groupBy("skill").agg(
        F.count("*").alias("count"),
        F.first("role_type").alias("role_type"),
    ).orderBy(F.desc("count"))
    return [row.asDict() for row in result.collect()]


def compute_salary_stats(df):
    df_sal = df.filter(F.col("salary_min").isNotNull() & F.col("salary_max").isNotNull()) \
        .withColumn("avg_salary", (F.col("salary_min") + F.col("salary_max")) / 2)

    results = []
    for group_type, col in [("role", "role_type"), ("location", "location"), ("experience", "experience_level")]:
        grouped = df_sal.groupBy(col).agg(
            F.avg("avg_salary").alias("avg_salary"),
            F.min("salary_min").alias("min_salary"),
            F.max("salary_max").alias("max_salary"),
            F.count("*").alias("count"),
        )
        if group_type == "location":
            grouped = grouped.orderBy(F.desc("count")).limit(15)
        for row in grouped.collect():
            results.append({
                "group_key": f"{group_type}_{row[col]}",
                "group_type": group_type,
                "group_value": row[col],
                "avg_salary": round(float(row["avg_salary"]), 2),
                "min_salary": round(float(row["min_salary"]), 2),
                "max_salary": round(float(row["max_salary"]), 2),
                "count": int(row["count"]),
            })
    return results


def compute_work_type_stats(df):
    rows = df.groupBy("work_type").count().collect()
    return [{"work_type": r["work_type"], "count": r["count"]} for r in rows]


def compute_company_stats(df):
    rows = df.groupBy("company").count().orderBy(F.desc("count")).limit(20).collect()
    return [{"company": r["company"], "count": r["count"]} for r in rows]


def compute_demand_stats(df):
    rows = df.groupBy("experience_level").count().collect()
    return [{"experience_level": r["experience_level"], "count": r["count"]} for r in rows]


def run_spark_processing():
    print("Running PySpark processing...")
    spark = get_spark()
    df = load_jobs_spark(spark)
    if df.count() == 0:
        print("No jobs to process.")
        spark.stop()
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

    spark.stop()
    print("PySpark processing complete.")


if __name__ == "__main__":
    run_spark_processing()
