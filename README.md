# Church Finance Management System

A comprehensive financial management system for church organizations with multi-province fund tracking, budget management, and reporting capabilities.

## Quick Start

To run both the backend and frontend applications, simply execute:

```bash
python start_app.py
```

This script will:
1. Set up the backend environment
2. Install all backend dependencies
3. Start the backend server on http://localhost:8000
4. Check for Node.js installation
5. If Node.js is available, install frontend dependencies and start the frontend server on http://localhost:3000
6. Open your browser to the frontend application

## Manual Setup

### Backend

1. Navigate to the `church_finance_backend` directory
2. Install dependencies: `pip install -r requirements.txt`
3. Create a `.env` file based on `.env.example`
4. Start the server: `uvicorn app.main:app --reload`
5. Access the API at http://localhost:8000
6. View API documentation at http://localhost:8000/docs

### Frontend

1. Navigate to the `church_finance_frontend` directory
2. Install Node.js if not already installed (https://nodejs.org/)
3. Install dependencies: `npm install`
4. Start the development server: `npm start`
5. Access the application at http://localhost:3000

## Requirements

- Python 3.8+
- Node.js 14+ (for frontend)
- pip (Python package manager)

## Features

- User authentication with JWT
- Role-based access control
- Transaction management
- Budget vs actual tracking
- Province performance monitoring
- Financial reporting
- AI-powered anomaly detection
- Email notifications
- Chatbot assistance

## Tech Stack

### Backend
- FastAPI (Python)
- SQLite (development) / PostgreSQL (production)
- SQLAlchemy ORM

### Frontend
- React 18
- React Router v6
- Axios for API calls
- Chart.js for data visualization
- Tailwind CSS for styling
- React Hook Form for form handling