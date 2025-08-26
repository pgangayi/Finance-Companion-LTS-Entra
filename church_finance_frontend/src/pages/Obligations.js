import React, { useState } from 'react';
import { useApi, useApiPost, useApiPut, useApiDelete } from '../hooks/useApi';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { format } from 'date-fns';

const Obligations = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingObligation, setEditingObligation] = useState(null);
  const [projects, setProjects] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('');

  const { data: obligations, loading, error, refetch } = useApi('/api/v1/obligations');
  const { data: projectsData } = useApi('/api/v1/projects');
  const { postData } = useApiPost();
  const { putData } = useApiPut();
  const { deleteData } = useApiDelete();

  React.useEffect(() => {
    if (projectsData) setProjects(projectsData);
  }, [projectsData]);

  const handleCreate = async (obligationData) => {
    const result = await postData('/api/v1/obligations', obligationData);
    if (result.success) {
      setShowForm(false);
      refetch();
    }
  };

  const handleUpdate = async (obligationData) => {
    const result = await putData(`/api/v1/obligations/${editingObligation.id}`, obligationData);
    if (result.success) {
      setEditingObligation(null);
      refetch();
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this obligation?')) {
      const result = await deleteData(`/api/v1/obligations/${id}`);
      if (result.success) {
        refetch();
      }
    }
  };

  const handleEdit = (obligation) => {
    setEditingObligation(obligation);
    setShowForm(true);
  };

  const ObligationForm = ({ obligation, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
      description: obligation?.description || '',
      amount: obligation?.amount || '',
      due_date: obligation?.due_date || '',
      status: obligation?.status || 'Pending',
      linked_project_id: obligation?.linked_project_id || ''
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
          <label className="form-label">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="form-input"
            rows="3"
            required
          />
        </div>

        <div>
          <label className="form-label">Amount</label>
          <input
            type="number"
            step="0.01"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>

        <div>
          <label className="form-label">Due Date</label>
          <input
            type="date"
            name="due_date"
            value={formData.due_date}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>

        <div>
          <label className="form-label">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="form-input"
          >
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
            <option value="Overdue">Overdue</option>
          </select>
        </div>

        <div>
          <label className="form-label">Linked Project</label>
          <select
            name="linked_project_id"
            value={formData.linked_project_id}
            onChange={handleChange}
            className="form-input"
          >
            <option value="">Select a project</option>
            {projects.map(project => (
              <option key={project.id} value={project.id}>{project.name}</option>
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
            {obligation ? 'Update' : 'Create'} Obligation
          </button>
        </div>
      </form>
    );
  };

  const filteredObligations = obligations?.filter(obligation => {
    return selectedStatus === '' || obligation.status === selectedStatus;
  });

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading obligations...</div>;
  }

  if (error) {
    return <div className="alert alert-error">Error loading obligations: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Obligations</h1>
        <div className="flex space-x-2">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="form-input"
          >
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
            <option value="Overdue">Overdue</option>
          </select>
          <button
            onClick={() => {
              setEditingObligation(null);
              setShowForm(true);
            }}
            className="btn-primary flex items-center"
          >
            <FaPlus className="mr-2" />
            Add Obligation
          </button>
        </div>
      </div>

      {showForm ? (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            {editingObligation ? 'Edit Obligation' : 'Add New Obligation'}
          </h2>
          <ObligationForm
            obligation={editingObligation}
            onSubmit={editingObligation ? handleUpdate : handleCreate}
            onCancel={() => {
              setShowForm(false);
              setEditingObligation(null);
            }}
          />
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Project
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredObligations?.map((obligation) => {
                const project = projects.find(p => p.id === obligation.linked_project_id);
                const statusColors = {
                  'Pending': 'bg-yellow-100 text-yellow-800',
                  'Completed': 'bg-green-100 text-green-800',
                  'Overdue': 'bg-red-100 text-red-800'
                };
                
                return (
                  <tr key={obligation.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {obligation.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${obligation.amount?.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {obligation.due_date ? format(new Date(obligation.due_date), 'MMM dd, yyyy') : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[obligation.status]}`}>
                        {obligation.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {project?.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(obligation)}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(obligation.id)}
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

export default Obligations;