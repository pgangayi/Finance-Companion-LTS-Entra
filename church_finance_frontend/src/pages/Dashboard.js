import React, { useState, useEffect } from 'react';
import DashboardCard from '../components/DashboardCard';
import ChartContainer from '../components/ChartContainer';
import { FaChartLine, FaMoneyBillWave, FaProjectDiagram, FaBalanceScale } from 'react-icons/fa';
import { useApi } from '../hooks/useApi';

const Dashboard = () => {
  const [timeRange, setTimeRange] = useState('year');
  const { data: dashboardData, loading, error } = useApi('/api/v1/analytics/dashboard');

  // Sample data for charts
  const budgetComparisonData = {
    labels: ['Allocated', 'Actual'],
    datasets: [
      {
        label: 'Budget',
        data: [100000, 75000],
        backgroundColor: ['rgba(54, 162, 235, 0.6)', 'rgba(255, 99, 132, 0.6)'],
      },
    ],
  };

  const expenseDistributionData = {
    labels: ['Travel', 'Office Supplies', 'Equipment', 'Utilities', 'Food', 'Maintenance'],
    datasets: [
      {
        data: [12, 19, 8, 15, 10, 7],
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40'
        ],
      },
    ],
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading dashboard data...</div>;
  }

  if (error) {
    return <div className="alert alert-error">Error loading dashboard: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="flex items-center space-x-2">
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="form-input"
          >
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard 
          title="Total Receipts" 
          value={`$${dashboardData?.summary?.total_allocated?.toFixed(2) || '0.00'}`} 
          icon={<FaMoneyBillWave />}
          color="green"
        />
        <DashboardCard 
          title="Total Expenses" 
          value={`$${dashboardData?.summary?.total_spent?.toFixed(2) || '0.00'}`} 
          icon={<FaMoneyBillWave />}
          color="red"
        />
        <DashboardCard 
          title="Net Amount" 
          value={`$${dashboardData?.summary?.total_variance?.toFixed(2) || '0.00'}`} 
          icon={<FaBalanceScale />}
          color={dashboardData?.summary?.total_variance >= 0 ? "green" : "red"}
        />
        <DashboardCard 
          title="Projects" 
          value={dashboardData?.summary?.departments_over_budget || 0} 
          icon={<FaProjectDiagram />}
          color="blue"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartContainer 
          type="bar" 
          data={budgetComparisonData} 
          title="Budget vs Actual" 
        />
        <ChartContainer 
          type="pie" 
          data={expenseDistributionData} 
          title="Expense Distribution" 
        />
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          <div className="border-b pb-4">
            <p className="text-sm text-gray-500">New transaction added</p>
            <p className="font-medium">Office Supplies - $250.00</p>
            <p className="text-xs text-gray-400">2 hours ago</p>
          </div>
          <div className="border-b pb-4">
            <p className="text-sm text-gray-500">Budget approved</p>
            <p className="font-medium">Marketing Department - $5,000.00</p>
            <p className="text-xs text-gray-400">Yesterday</p>
          </div>
          <div className="border-b pb-4">
            <p className="text-sm text-gray-500">Project status updated</p>
            <p className="font-medium">Community Outreach - Active</p>
            <p className="text-xs text-gray-400">2 days ago</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;