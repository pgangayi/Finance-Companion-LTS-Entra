import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Transactions from './pages/Transactions';
import Budgets from './pages/Budgets';
import Projects from './pages/Projects';
import Obligations from './pages/Obligations';
import Reports from './pages/Reports';
import ProvinceStatement from './pages/ProvinceStatement';
import Chatbot from './components/Chatbot';
import { AuthProvider, useAuth } from './context/AuthContext';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <AppContent />
        </div>
      </Router>
    </AuthProvider>
  );
}

function AppContent() {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Login />} />
      </Routes>
    );
  }
  
  return (
    <>
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/budgets" element={<Budgets />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/obligations" element={<Obligations />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/province-statement" element={<ProvinceStatement />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </main>
      </div>
      <Chatbot />
    </>
  );
}

export default App;