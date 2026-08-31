"""
backend/app.py — Exposes Flask WSGI application from root app.py
Ensures compatibility if a cloud deployment specifies backend/ as working directory.
"""
import os
import sys

# Add repository root to path
ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

from app import app  # noqa: F401
