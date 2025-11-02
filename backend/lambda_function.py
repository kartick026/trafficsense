"""
AWS Lambda handler for TrafficSense backend.
Uses Mangum to wrap the FastAPI app from main.py for Lambda/API Gateway compatibility.
"""
import os
import sys

# Add the backend directory to the path so we can import main
backend_dir = os.path.dirname(os.path.abspath(__file__))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

# Import the FastAPI app and Mangum adapter
from main import app
from mangum import Mangum

# Create the Mangum adapter to wrap the FastAPI app
handler = Mangum(app, lifespan="off")
