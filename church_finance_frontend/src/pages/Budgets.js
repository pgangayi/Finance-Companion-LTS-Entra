import React, { useState } from 'react';
import { useApi, useApiPost, useApiPut, useApiDelete } from '../hooks/useApi';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

const Budgets = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const { data: budgets, loading, error, refetch } = useApi(`/api/v1/budgets?year=${selectedYear}`);
  const { data: departmentsData } = useApi('/api/v1/departments');
  const { postData } = useApiPost();
  const { putData } = useApiPut();
  const { deleteData } = useApiDelete();

  React.useEffect(() => {
    if (departmentsData) setDepartments(departmentsData);
  }, [departmentsData]);

  const handleCreate = async (budgetData) => {
    const result = await postData('/api/v1/budgets', budgetData);
    if (result.success) {
      setShowForm(false);
      refetch();
    }
  };

  const handleUpdate = async (budgetData) => {
    const result = await putData(`/api/v1/budgets/${editingBudget.id}`, budgetData);
    if (result.success) {
      setEditingBudget(null);
      refetch();
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      const result = await deleteData(`/api/v1/budgets/${id}`);
      if (result.success) {
        refetch();
      }
    }
  };

  const handleEdit = (budget) => {
    setEditingBudget(budget);
    setShowForm(true);
  };

  const BudgetForm = ({ budget, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
      year: budget?.year || selectedYear,
      department_id: budget?.department_id || '',
      allocated_amount: budget?.allocated_amount || ''
    });

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({
        ...formData,
        [name]: value
      });
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      onSubmit(formData);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="form-label">Year</label>
          <input
            type="number"
            name="year"
            value={formData.year}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>

        <div>
          <label className="form-label">Department</label>
          <select
            name="department_id"
            value={formData.department_id}
            onChange={handleChange}
            className="form-input"
            required
          >
            <option value="">Select a department</option>
            {departments.map(dept => (
              <option key={dept.id} value={dept.id}>{dept.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="form-label">Allocated Amount</label>
          <input
            type="number"
            step="0.01"
            name="allocated_amount"
            value={formData.allocated_amount}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary"
          >
            {budget ? 'Update' : 'Create'} Budget
          </button>
        </div>
      </form>
    );
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading budgets...</div>;
  }

  if (error) {
    return <div className="alert alert-error">Error loading budgets: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Budgets</h1>
        <div className="flex space-x-2">
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
            onClick={() => {
              setEditingBudget(null);
              setShowForm(true);
            }}
            className="btn-primary flex items-center"
          >
            <FaPlus className="mr-2" />
            Add Budget
          </button>
        </div>
      </div>

      {showForm ? (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            {editingBudget ? 'Edit Budget' : 'Add New Budget'}
          </h2>
          <BudgetForm
            budget={editingBudget}
            onSubmit={editingBudget ? handleUpdate : handleCreate}
            onCancel={() => {
              setShowForm(false);
              setEditingBudget(null);
            }}
          />
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Allocated
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actual Spent
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Variance
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {budgets?.map((budget) => {
                const variance = budget.allocated_amount - budget.actual_spent;
                const variancePercentage = (variance / budget.allocated_amount * 100).toFixed(2);
                const isOverBudget = variance < 0;
                
                return (
                  <tr key={budget.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {departments.find(d => d.id === budget.department_id)?.name || 'Unknown Department'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${budget.allocated_amount?.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${budget.actual_spent?.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={isOverBudget ? 'text-red-600' : 'text-green-600'}>
                        ${Math.abs(variance).toFixed(2)} ({Math.abs(variancePercentage)}%)
                        {isOverBudget ? ' over' : ' under'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(budget)}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(budget.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Budgets;