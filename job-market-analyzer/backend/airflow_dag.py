"""Airflow DAG for daily job market data pipeline."""
from datetime import datetime, timedelta
from airflow import DAG
from airflow.operators.python import PythonOperator

default_args = {
    "owner": "airflow",
    "depends_on_past": False,
    "email_on_failure": False,
    "retries": 1,
    "retry_delay": timedelta(minutes=5),
}

dag = DAG(
    "job_market_analyzer",
    default_args=default_args,
    description="Daily job market data pipeline",
    schedule_interval="0 8 * * *",
    start_date=datetime(2025, 1, 1),
    catchup=False,
    tags=["jobs", "analytics"],
)


def task_fetch():
    from fetch_jobs import run_fetch
    run_fetch()


def task_process():
    try:
        from process_spark import run_spark_processing
        run_spark_processing()
    except ImportError:
        from process_pandas import run_pandas_processing
        run_pandas_processing()


def task_export():
    from export_csv import export_all_csv
    export_all_csv()


fetch = PythonOperator(task_id="fetch_jobs", python_callable=task_fetch, dag=dag)
process = PythonOperator(task_id="process_analytics", python_callable=task_process, dag=dag)
export = PythonOperator(task_id="export_csv", python_callable=task_export, dag=dag)

fetch >> process >> export
