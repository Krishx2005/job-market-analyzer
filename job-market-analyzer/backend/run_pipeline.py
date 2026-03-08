#!/usr/bin/env python3
"""Orchestrates the full ETL pipeline: fetch -> store -> process -> export."""
import argparse
import sys


def main():
    parser = argparse.ArgumentParser(description="Job Market Analyzer Pipeline")
    parser.add_argument("--use-spark", action="store_true", help="Use PySpark instead of Pandas")
    parser.add_argument("--export-csv", action="store_true", help="Export results to CSV")
    parser.add_argument("--skip-fetch", action="store_true", help="Skip API fetch, process existing data")
    args = parser.parse_args()

    # Step 1: Fetch
    if not args.skip_fetch:
        print("=" * 50)
        print("STEP 1: Fetching jobs from JSearch API")
        print("=" * 50)
        from fetch_jobs import run_fetch
        run_fetch()
    else:
        print("Skipping fetch step.")

    # Step 2: Process
    print("\n" + "=" * 50)
    print("STEP 2: Processing analytics")
    print("=" * 50)

    use_spark = args.use_spark
    if use_spark:
        try:
            from process_spark import run_spark_processing
            run_spark_processing()
        except ImportError:
            print("PySpark not available, falling back to Pandas.")
            use_spark = False

    if not use_spark:
        from process_pandas import run_pandas_processing
        run_pandas_processing()

    # Step 3: Export
    if args.export_csv:
        print("\n" + "=" * 50)
        print("STEP 3: Exporting CSV files")
        print("=" * 50)
        from export_csv import export_all_csv
        export_all_csv()

    print("\nPipeline complete!")


if __name__ == "__main__":
    main()
