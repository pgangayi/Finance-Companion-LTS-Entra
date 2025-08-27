#!/usr/bin/env python3
"""
Script to start the backend application for the Church Finance Management System.
"""

import os
import subprocess
import sys
import time
import webbrowser

def start_backend():
    """Start the backend application."""
    print("Starting backend server...")
    backend_dir = "church_finance_backend"
    
    # Change to backend directory
    if os.path.exists(backend_dir):
        os.chdir(backend_dir)
    
    # Start the backend server
    try:
        backend_process = subprocess.Popen([
            sys.executable, "-m", "uvicorn", 
            "app.main:app", "--reload", "--host", "0.0.0.0", "--port", "8000"
        ])
        print("Backend server started on http://localhost:8000")
        print("API documentation available at http://localhost:8000/docs")
        return backend_process
    except Exception as e:
        print(f"Failed to start backend server: {e}")
        return None

def main():
    """Main function to start the backend application."""
    print("Church Finance Management System - Backend Startup Script")
    print("=" * 50)
    
    # Start backend
    backend_process = start_backend()
    if not backend_process:
        print("Failed to start backend. Exiting.")
        return
    
    print("\nBackend is now running:")
    print("- Backend API: http://localhost:8000")
    print("- API Documentation: http://localhost:8000/docs")
    print("\nPress Ctrl+C to stop the backend application.")
    
    try:
        # Wait for backend process
        backend_process.wait()
    except KeyboardInterrupt:
        print("\nShutting down backend application...")
        backend_process.terminate()
        print("Backend application stopped.")

if __name__ == "__main__":
    main()