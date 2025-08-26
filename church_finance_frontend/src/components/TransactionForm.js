import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';

const TransactionForm = ({ transaction, onSubmit, onCancel, provinces, departments, projects }) => {
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm({
    defaultValues: transaction || {
      date: new Date().toISOString().split('T')[0],
      type: 'receipt',
      amount: '',
      description: '',
      category: '',
      project_id: '',
      department_id: '',
      province_id: ''
    }
  });

  useEffect(() => {
    if (transaction) {
      reset(transaction);
    }
  }, [transaction, reset]);

  const handleFormSubmit = (data) => {
    // Convert amount to number
    data.amount = parseFloat(data.amount);
    
    // Convert empty strings to null for foreign keys
    data.project_id = data.project_id || null;
    data.department_id = data.department_id || null;
    data.province_id = data.province_id || null;
    
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div>
        <label className="form-label">Date</label>
        <input
          type="date"
          {...register('date', { required: 'Date is required' })}
          className="form-input"
        />
        {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date.message}</p>}
      </div>

      <div>
        <label className="form-label">Type</label>
        <select
          {...register('type', { required: 'Type is required' })}
          className="form-input"
        >
          <option value="receipt">Receipt</option>
          <option value="expense">Expense</option>
          <option value="transfer">Transfer</option>
        </select>
        {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type.message}</p>}
      </div>

      <div>
        <label className="form-label">Amount</label>
        <input
          type="number"
          step="0.01"
          {...register('amount', { 
            required: 'Amount is required',
            min: { value: 0.01, message: 'Amount must be greater than 0' }
          })}
          className="form-input"
        />
        {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount.message}</p>}
      </div>

      <div>
        <label className="form-label">Description</label>
        <textarea
          {...register('description', { required: 'Description is required' })}
          className="form-input"
          rows="3"
        />
        {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
      </div>

      <div>
        <label className="form-label">Category</label>
        <input
          type="text"
          {...register('category')}
          className="form-input"
        />
      </div>

      <div>
        <label className="form-label">Project</label>
        <select
          {...register('project_id')}
          className="form-input"
        >
          <option value="">Select a project</option>
          {projects.map(project => (
            <option key={project.id} value={project.id}>{project.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="form-label">Department</label>
        <select
          {...register('department_id')}
          className="form-input"
        >
          <option value="">Select a department</option>
          {departments.map(department => (
            <option key={department.id} value={department.id}>{department.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="form-label">Province</label>
        <select
          {...register('province_id')}
          className="form-input"
        >
          <option value="">Select a province</option>
          {provinces.map(province => (
            <option key={province.id} value={province.id}>{province.name}</option>
          ))}
        </select>
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
          {transaction ? 'Update' : 'Create'} Transaction
        </button>
      </div>
    </form>
  );
};

export default TransactionForm;