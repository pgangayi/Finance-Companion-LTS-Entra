import React, { useState } from 'react';
import { useApi } from '../hooks/useApi';
import { FaDownload, FaChartBar, FaFileExcel, FaFilePdf } from 'react-icons/fa';
import ChartContainer from '../components/ChartContainer';

const Reports = () => {
  const [reportType, setReportType] = useState('budget-vs-actual');
  const [timeRange, setTimeRange] = useState('year');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const { data: reportData, loading, error } = useApi(`/api/v1/analytics/dashboard/${selectedYear}`);

  // Sample data for charts
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
    // In a real application, this would call an API endpoint to generate and download the report
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
            
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Department
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Allocated Budget
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actual Spent
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Variance
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Variance %
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Department A
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      $30,000.00
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      $28,000.00
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                      $2,000.00
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                      6.67%
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Department B
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      $25,000.00
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      $22,000.00
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                      $3,000.00
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                      12.00%
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'province-performance':
        return (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Province
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Receipts
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Expenses
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Net Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Performance %
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Province A
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    $50,000.00
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    $30,000.00
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                    $20,000.00
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                    100%
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Province B
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    $40,000.00
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    $35,000.00
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                    $5,000.00
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-600">
                    80%
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        );
      case 'transaction-summary':
        return (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Month
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Receipts
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expenses
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Net Amount
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    January
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    $15,000.00
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    $10,000.00
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                    $5,000.00
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    February
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    $12,000.00
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    $11,000.00
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                    $1,000.00
                  </td>
                </tr>
              </tbody>
            </table>
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