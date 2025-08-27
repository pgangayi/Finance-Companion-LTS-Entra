import React, { useState } from 'react';
import { useApi } from '../hooks/useApi';
import { FaFileExcel, FaFilePdf } from 'react-icons/fa';
import ChartContainer from '../components/ChartContainer';

const Reports = () => {
  const [reportType, setReportType] = useState('budget-vs-actual');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const { loading, error } = useApi(`/api/v1/analytics/dashboard/${selectedYear}`);

  const budgetComparisonData = {
    labels: ['Department A', 'Department B', 'Department C', 'Department D'],
    datasets: [
      {
        label: 'Allocated Budget',
        data: [30000, 25000, 35000, 20000],
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
      },
      {
        label: 'Actual Spent',
        data: [28000, 22000, 38000, 18000],
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      }
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

  const handleExport = (format) => {
    alert(`Exporting ${reportType} report in ${format} format`);
  };

  const renderReportContent = () => {
    switch (reportType) {
      case 'budget-vs-actual':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartContainer 
                type="bar" 
                data={budgetComparisonData} 
                title="Budget vs Actual by Department" 
              />
              <ChartContainer 
                type="pie" 
                data={expenseDistributionData} 
                title="Expense Distribution" 
              />
            </div>
            {/* Table content continues as you had it */}
          </div>
        );
      case 'province-performance':
        return (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {/* Table content continues as you had it */}
          </div>
        );
      case 'transaction-summary':
        return (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {/* Table content continues as you had it */}
          </div>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading report data...</div>;
  }

  if (error) {
    return <div className="alert alert-error">Error loading report data: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
        <div className="flex space-x-2">
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="form-input"
          >
            <option value="budget-vs-actual">Budget vs Actual</option>
            <option value="province-performance">Province Performance</option>
            <option value="transaction-summary">Transaction Summary</option>
          </select>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="form-input"
          >
            {[2020, 2021, 2022, 2023, 2024, 2025, 2026].map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          <button
            onClick={() => handleExport('excel')}
            className="btn-secondary flex items-center"
          >
            <FaFileExcel className="mr-2" />
            Excel
          </button>
          <button
            onClick={() => handleExport('pdf')}
            className="btn-secondary flex items-center"
          >
            <FaFilePdf className="mr-2" />
            PDF
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          {reportType === 'budget-vs-actual' && 'Budget vs Actual Report'}
          {reportType === 'province-performance' && 'Province Performance Report'}
          {reportType === 'transaction-summary' && 'Transaction Summary Report'}
        </h2>
        {renderReportContent()}
      </div>
    </div>
  );
};

export default Reports;