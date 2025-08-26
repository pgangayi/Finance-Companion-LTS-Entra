import React, { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import { FaDownload, FaFileExcel, FaFilePdf } from 'react-icons/fa';
import { format } from 'date-fns';

const ProvinceStatement = () => {
  const [selectedProvince, setSelectedProvince] = useState('');
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [provinces, setProvinces] = useState([]);
  const { data: statementData, loading, error, refetch } = useApi(
    selectedProvince 
      ? `/api/v1/receipts/province-statement/${selectedProvince}?start_date=${dateRange.startDate}&end_date=${dateRange.endDate}`
      : null
  );

  const { data: provincesData } = useApi('/api/v1/provinces');

  useEffect(() => {
    if (provincesData) setProvinces(provincesData);
  }, [provincesData]);

  useEffect(() => {
    if (selectedProvince) {
      refetch();
    }
  }, [selectedProvince, dateRange, refetch]);

  const handleExport = (format) => {
    // In a real application, this would call an API endpoint to generate and download the report
    alert(`Exporting province statement for ${provinces.find(p => p.id == selectedProvince)?.name} in ${format} format`);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading province statement...</div>;
  }

  if (error) {
    return <div className="alert alert-error">Error loading province statement: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Province Statement</h1>
        <div className="flex space-x-2">
          <select
            value={selectedProvince}
            onChange={(e) => setSelectedProvince(e.target.value)}
            className="form-input"
          >
            <option value="">Select a province</option>
            {provinces.map(province => (
              <option key={province.id} value={province.id}>{province.name}</option>
            ))}
          </select>
          <input
            type="date"
            value={dateRange.startDate}
            onChange={(e) => setDateRange({...dateRange, startDate: e.target.value})}
            className="form-input"
          />
          <input
            type="date"
            value={dateRange.endDate}
            onChange={(e) => setDateRange({...dateRange, endDate: e.target.value})}
            className="form-input"
          />
          <button
            onClick={() => handleExport('excel')}
            className="btn-secondary flex items-center"
            disabled={!selectedProvince}
          >
            <FaFileExcel className="mr-2" />
            Excel
          </button>
          <button
            onClick={() => handleExport('pdf')}
            className="btn-secondary flex items-center"
            disabled={!selectedProvince}
          >
            <FaFilePdf className="mr-2" />
            PDF
          </button>
        </div>
      </div>

      {selectedProvince && statementData ? (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                {provinces.find(p => p.id == selectedProvince)?.name} Statement
              </h2>
              <p className="text-gray-500">
                {format(new Date(dateRange.startDate), 'MMM dd, yyyy')} - {format(new Date(dateRange.endDate), 'MMM dd, yyyy')}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Total Receipts</p>
                <p className="text-2xl font-bold text-green-600">
                  ${statementData.summary?.total_receipts?.toFixed(2) || '0.00'}
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Total Expenses</p>
                <p className="text-2xl font-bold text-red-600">
                  ${statementData.summary?.total_expenses?.toFixed(2) || '0.00'}
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Net Amount</p>
                <p className="text-2xl font-bold text-blue-600">
                  ${statementData.summary?.net_amount?.toFixed(2) || '0.00'}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {statementData.transactions?.map((transaction) => (
                    <tr key={transaction.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {format(new Date(transaction.date), 'MMM dd, yyyy')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          transaction.type === 'receipt' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {transaction.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {transaction.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${transaction.amount?.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {transaction.category || 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-500">
            {selectedProvince 
              ? 'Select a province and date range to view the statement' 
              : 'Please select a province to view the statement'}
          </p>
        </div>
      )}
    </div>
  );
};

export default ProvinceStatement;