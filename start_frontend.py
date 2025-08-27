#!/usr/bin/env python3
"""
Script to start the frontend application for the Church Finance Management System.
"""

import os
import subprocess
import sys
import time
import webbrowser

def check_node_installed():
    """Check if Node.js is installed."""
    try:
        subprocess.run(["node", "--version"], check=True, capture_output=True)
        return True
    except (subprocess.CalledProcessError, FileNotFoundError):
        return False

def check_npm_installed():
    """Check if npm is installed."""
    try:
        subprocess.run(["npm", "--version"], check=True, capture_output=True)
        return True
    except (subprocess.CalledProcessError, FileNotFoundError):
        return False

def start_frontend():
    """Start the frontend application."""
    print("Starting frontend server...")
    frontend_dir = "church_finance_frontend"
    
    # Check if frontend directory exists
    if not os.path.exists(frontend_dir):
        print(f"Frontend directory '{frontend_dir}' not found.")
        return None
    
    # Change to frontend directory
    os.chdir(frontend_dir)
    
    # Check if Node.js is installed
    if not check_node_installed():
        print("Node.js is not installed. Please install Node.js to start the frontend.")
        return None
    
    # Check if npm is installed
    if not check_npm_installed():
        print("npm is not installed or not accessible. Please ensure npm is installed and in your PATH.")
        return None
    
    # Install dependencies if node_modules doesn't exist
    if not os.path.exists("node_modules"):
        print("Installing frontend dependencies...")
        try:
            subprocess.run(["npm", "install"], check=True)
            print("Frontend dependencies installed successfully.")
        except subprocess.CalledProcessError:
            print("Failed to install frontend dependencies.")
            return None
        except FileNotFoundError:
            print("npm command not found. Please ensure Node.js and npm are installed and in your PATH.")
            return None
    
    # Start the frontend server
    try:
        frontend_process = subprocess.Popen(["npm", "start"])
        print("Frontend server started on http://localhost:3000")
        return frontend_process
    except Exception as e:
        print(f"Failed to start frontend server: {e}")
        return None

def main():
    """Main function to start the frontend application."""
    print("Church Finance Management System - Frontend Startup Script")
    print("=" * 50)
    
    # Start frontend
    frontend_process = start_frontend()
    if not frontend_process:
        print("Failed to start frontend. Exiting.")
        return
    
    # Wait a moment for frontend to start
    time.sleep(10)
    
    # Open browser to frontend
    print("Opening browser to frontend application...")
    webbrowser.open("http://localhost:3000")
    
    print("\nFrontend is now running:")
    print("- Frontend App: http://localhost:3000")
    print("\nPress Ctrl+C to stop the frontend application.")
    
    try:
        # Wait for frontend process
        frontend_process.wait()
    except KeyboardInterrupt:
        print("\nShutting down frontend application...")
        frontend_process.terminate()
        print("Frontend application stopped.")

if __name__ == "__main__":
    main()