import React, { useState, useEffect } from 'react';
import TransactionTable from '../components/TransactionTable';
import TransactionForm from '../components/TransactionForm';
import { useApi, useApiPost, useApiPut, useApiDelete } from '../hooks/useApi';
import { FaPlus, FaFilter, FaDownload } from 'react-icons/fa';

const Transactions = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [filters, setFilters] = useState({
    type: '',
    category: '',
    startDate: '',
    endDate: ''
  });
  const [provinces, setProvinces] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [projects, setProjects] = useState([]);

  const { data: transactions, loading, error, refetch } = useApi('/api/v1/transactions');
  const { data: provincesData } = useApi('/api/v1/provinces');
  const { data: departmentsData } = useApi('/api/v1/departments');
  const { data: projectsData } = useApi('/api/v1/projects');
  const { postData } = useApiPost();
  const { putData } = useApiPut();
  const { deleteData } = useApiDelete();

  useEffect(() => {
    if (provincesData) setProvinces(provincesData);
    if (departmentsData) setDepartments(departmentsData);
    if (projectsData) setProjects(projectsData);
  }, [provincesData, departmentsData, projectsData]);

  const handleCreate = async (transactionData) => {
    const result = await postData('/api/v1/transactions', transactionData);
    if (result.success) {
      setShowForm(false);
      refetch();
    }
  };

  const handleUpdate = async (transactionData) => {
    const result = await putData(`/api/v1/transactions/${editingTransaction.id}`, transactionData);
    if (result.success) {
      setEditingTransaction(null);
      refetch();
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      const result = await deleteData(`/api/v1/transactions/${id}`);
      if (result.success) {
        refetch();
      }
    }
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setShowForm(true);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };

  const filteredTransactions = transactions?.filter(transaction => {
    return (
      (filters.type === '' || transaction.type === filters.type) &&
      (filters.category === '' || transaction.category === filters.category) &&
      (!filters.startDate || transaction.date >= filters.startDate) &&
      (!filters.endDate || transaction.date <= filters.endDate)
    );
  });

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading transactions...</div>;
  }

  if (error) {
    return <div className="alert alert-error">Error loading transactions: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => {
              setEditingTransaction(null);
              setShowForm(true);
            }}
            className="btn-primary flex items-center"
          >
            <FaPlus className="mr-2" />
            Add Transaction
          </button>
          <button className="btn-secondary flex items-center">
            <FaDownload className="mr-2" />
            Export
          </button>
        </div>
      </div>

      {showForm ? (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            {editingTransaction ? 'Edit Transaction' : 'Add New Transaction'}
          </h2>
          <TransactionForm
            transaction={editingTransaction}
            onSubmit={editingTransaction ? handleUpdate : handleCreate}
            onCancel={() => {
              setShowForm(false);
              setEditingTransaction(null);
            }}
            provinces={provinces}
            departments={departments}
            projects={projects}
          />
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Transaction List</h2>
              <div className="flex space-x-2">
                <div className="relative">
                  <input
                    type="date"
                    name="startDate"
                    value={filters.startDate}
                    onChange={handleFilterChange}
                    className="form-input"
                  />
                </div>
                <div className="relative">
                  <input
                    type="date"
                    name="endDate"
                    value={filters.endDate}
                    onChange={handleFilterChange}
                    className="form-input"
                  />
                </div>
                <select
                  name="type"
                  value={filters.type}
                  onChange={handleFilterChange}
                  className="form-input"
                >
                  <option value="">All Types</option>
                  <option value="receipt">Receipt</option>
                  <option value="expense">Expense</option>
                  <option value="transfer">Transfer</option>
                </select>
                <select
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                  className="form-input"
                >
                  <option value="">All Categories</option>
                  <option value="Travel">Travel</option>
                  <option value="Office Supplies">Office Supplies</option>
                  <option value="Equipment">Equipment</option>
                  <option value="Utilities">Utilities</option>
                  <option value="Food">Food</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
                <button className="btn-secondary flex items-center">
                  <FaFilter className="mr-2" />
                  Filter
                </button>
              </div>
            </div>
            <TransactionTable
              transactions={filteredTransactions}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Transactions;