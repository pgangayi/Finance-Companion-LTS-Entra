import React, { useState } from 'react';
import { useApi, useApiPost, useApiPut, useApiDelete } from '../hooks/useApi';
import { FaPlus, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import { format } from 'date-fns';

const Projects = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [viewingProject, setViewingProject] = useState(null);
  const [provinces, setProvinces] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('');

  const { data: projects, loading, error, refetch } = useApi('/api/v1/projects');
  const { data: provincesData } = useApi('/api/v1/provinces');
  const { postData } = useApiPost();
  const { putData } = useApiPut();
  const { deleteData } = useApiDelete();

  React.useEffect(() => {
    if (provincesData) setProvinces(provincesData);
  }, [provincesData]);

  const handleCreate = async (projectData) => {
    const result = await postData('/api/v1/projects', projectData);
    if (result.success) {
      setShowForm(false);
      refetch();
    }
  };

  const handleUpdate = async (projectData) => {
    const result = await putData(`/api/v1/projects/${editingProject.id}`, projectData);
    if (result.success) {
      setEditingProject(null);
      refetch();
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      const result = await deleteData(`/api/v1/projects/${id}`);
      if (result.success) {
        refetch();
      }
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setShowForm(true);
  };

  const handleView = (project) => {
    setViewingProject(project);
  };

  const ProjectForm = ({ project, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
      name: project?.name || '',
      type: project?.type || '',
      province_id: project?.province_id || '',
      status: project?.status || 'Planned',
      start_date: project?.start_date || '',
      end_date: project?.end_date || ''
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
          <label className="form-label">Project Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>

        <div>
          <label className="form-label">Type</label>
          <input
            type="text"
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="form-input"
          />
        </div>

        <div>
          <label className="form-label">Province</label>
          <select
            name="province_id"
            value={formData.province_id}
            onChange={handleChange}
            className="form-input"
          >
            <option value="">Select a province</option>
            {provinces.map(province => (
              <option key={province.id} value={province.id}>{province.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="form-label">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="form-input"
          >
            <option value="Planned">Planned</option>
            <option value="Active">Active</option>
            <option value="Completed">Completed</option>
            <option value="On Hold">On Hold</option>
          </select>
        </div>

        <div>
          <label className="form-label">Start Date</label>
          <input
            type="date"
            name="start_date"
            value={formData.start_date}
            onChange={handleChange}
            className="form-input"
          />
        </div>

        <div>
          <label className="form-label">End Date</label>
          <input
            type="date"
            name="end_date"
            value={formData.end_date}
            onChange={handleChange}
            className="form-input"
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
            {project ? 'Update' : 'Create'} Project
          </button>
        </div>
      </form>
    );
  };

  const ProjectView = ({ project, onClose }) => {
    const province = provinces.find(p => p.id === project.province_id);
    
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">{project.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            Close
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Type</p>
            <p className="font-medium">{project.type || 'N/A'}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500">Province</p>
            <p className="font-medium">{province?.name || 'N/A'}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500">Status</p>
            <p className="font-medium">{project.status}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500">Start Date</p>
            <p className="font-medium">
              {project.start_date ? format(new Date(project.start_date), 'MMM dd, yyyy') : 'N/A'}
            </p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500">End Date</p>
            <p className="font-medium">
              {project.end_date ? format(new Date(project.end_date), 'MMM dd, yyyy') : 'N/A'}
            </p>
          </div>
        </div>
        
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Financial Summary</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-sm text-gray-500">Total Receipts</p>
                <p className="text-lg font-bold text-green-600">$0.00</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Expenses</p>
                <p className="text-lg font-bold text-red-600">$0.00</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Net Amount</p>
                <p className="text-lg font-bold text-blue-600">$0.00</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const filteredProjects = projects?.filter(project => {
    return selectedStatus === '' || project.status === selectedStatus;
  });

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading projects...</div>;
  }

  if (error) {
    return <div className="alert alert-error">Error loading projects: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
        <div className="flex space-x-2">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="form-input"
          >
            <option value="">All Statuses</option>
            <option value="Planned">Planned</option>
            <option value="Active">Active</option>
            <option value="Completed">Completed</option>
            <option value="On Hold">On Hold</option>
          </select>
          <button
            onClick={() => {
              setEditingProject(null);
              setShowForm(true);
            }}
            className="btn-primary flex items-center"
          >
            <FaPlus className="mr-2" />
            Add Project
          </button>
        </div>
      </div>

      {showForm ? (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            {editingProject ? 'Edit Project' : 'Add New Project'}
          </h2>
          <ProjectForm
            project={editingProject}
            onSubmit={editingProject ? handleUpdate : handleCreate}
            onCancel={() => {
              setShowForm(false);
              setEditingProject(null);
            }}
          />
        </div>
      ) : viewingProject ? (
        <ProjectView 
          project={viewingProject} 
          onClose={() => setViewingProject(null)} 
        />
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Project Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Province
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dates
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProjects?.map((project) => {
                const province = provinces.find(p => p.id === project.province_id);
                const statusColors = {
                  'Planned': 'bg-yellow-100 text-yellow-800',
                  'Active': 'bg-green-100 text-green-800',
                  'Completed': 'bg-blue-100 text-blue-800',
                  'On Hold': 'bg-red-100 text-red-800'
                };
                
                return (
                  <tr key={project.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {project.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {project.type || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {province?.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[project.status]}`}>
                        {project.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {project.start_date ? format(new Date(project.start_date), 'MMM dd, yyyy') : 'N/A'}
                      <br />
                      {project.end_date ? format(new Date(project.end_date), 'MMM dd, yyyy') : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleView(project)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        <FaEye />
                      </button>
                      <button
                        onClick={() => handleEdit(project)}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(project.id)}
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

export default Projects;