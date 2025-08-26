# Church Finance Management System

A comprehensive financial management system for church organizations with multi-province fund tracking, budget management, and reporting capabilities.

## Features

- User authentication with JWT
- Microsoft Entra External ID integration
- Role-based access control
- Transaction management
- Budget vs actual tracking
- Province performance monitoring
- Financial reporting
- AI-powered anomaly detection
- Email notifications
- Chatbot assistance

## Tech Stack

- Backend: FastAPI (Python)
- Database: PostgreSQL
- Frontend: React
- Deployment: Render/Railway

## Getting Started

1. Install dependencies
2. Set up database
3. Configure environment variables
4. Run the application

## Microsoft Entra External ID Integration

This application supports authentication using Microsoft Entra External ID (formerly Azure AD B2C). To configure:

1. Register an application in your Microsoft Entra External ID tenant
2. Configure the redirect URI to match your frontend URL
3. Add the following environment variables to your `.env` file:
   - `MS_ENTRA_CLIENT_ID`: Your application's client ID
   - `MS_ENTRA_CLIENT_SECRET`: Your application's client secret
   - `MS_ENTRA_TENANT_ID`: Your tenant ID
   - `MS_ENTRA_REDIRECT_URI`: The redirect URI configured in Microsoft Entra

## API Documentation

API documentation is available at `/docs` when the server is running.