#!/usr/bin/env bash
set -e
pip install -r requirements.txt
python seed_mock_data.py
python run_pipeline.py --skip-fetch
