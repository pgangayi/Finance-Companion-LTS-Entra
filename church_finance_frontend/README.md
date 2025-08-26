# Church Finance Management System - Frontend

React frontend for the Church Finance Management System.

## Features

- User authentication with JWT
- Microsoft Entra External ID integration
- Role-based access control
- Transaction management
- Budget vs actual tracking
- Province performance monitoring
- Financial reporting
- AI chatbot assistance

## Tech Stack

- React 18
- React Router v6
- Axios for API calls
- Chart.js for data visualization
- Tailwind CSS for styling
- React Hook Form for form handling

## Getting Started

1. Install dependencies: `npm install`
2. Start development server: `npm start`
3. Build for production: `npm run build`

## Microsoft Entra External ID Integration

The frontend now supports authentication using Microsoft Entra External ID. Users can choose to sign in with their Microsoft accounts by clicking the "Sign in with Microsoft" button on the login page.

## Folder Structure

- `src/` - Main source code
  - `components/` - Reusable UI components
  - `pages/` - Page components
  - `services/` - API service functions
  - `hooks/` - Custom React hooks
  - `utils/` - Utility functions
  - `assets/` - Static assets
  - `context/` - React context providers