#!/bin/bash
# Daily job market analyzer pipeline
# Add to crontab: 0 8 * * * /path/to/job-market-analyzer/cron_job.sh >> /path/to/job-market-analyzer/cron.log 2>&1

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR/backend"

echo "$(date): Starting job market pipeline..."
python3 run_pipeline.py --export-csv
echo "$(date): Pipeline complete."
