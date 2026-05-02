import { useEffect, useState } from 'react';
import { cityService } from '../services/apiService';
import AdminLayout from '../components/AdminLayout';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminCities() {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '' });
  const [editingId, setEditingId] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCities();
  }, []);

  const fetchCities = async () => {
    try {
      setLoading(true);
      const response = await cityService.getAll();
      setCities(response.data.data || []);
    } catch (err) {
      toast.error('Failed to load cities');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingId(null);
    setFormData({ name: '' });
    setShowForm(true);
  };

  const handleEdit = (city) => {
    setEditingId(city._id);
    setFormData({ name: city.name });
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setFormData({ name: '' });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('City name is required');
      return;
    }

    if (formData.name.trim().length < 2) {
      toast.error('City name must be at least 2 characters');
      return;
    }

    try {
      setSubmitting(true);

      if (editingId) {
        // Update existing city
        await cityService.update(editingId, { name: formData.name.trim() });
        setCities(cities.map(c => c._id === editingId ? { ...c, name: formData.name.trim() } : c));
        toast.success('City updated successfully!');
      } else {
        // Create new city
        const response = await cityService.create({ name: formData.name.trim() });
        setCities([...cities, response.data.data]);
        toast.success('City added successfully!');
      }

      setShowForm(false);
      setFormData({ name: '' });
      setEditingId(null);

    } catch (err) {
      console.error('Failed to save city:', err);
      toast.error(err.response?.data?.message || 'Failed to save city');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (cityId) => {
    try {
      setSubmitting(true);
      setError('');
      await cityService.delete(cityId);
      setCities(cities.filter(c => c._id !== cityId));
      setDeleteConfirm(null);
      toast.success('City deleted successfully!');
    } catch (err) {
      console.error('Failed to delete city:', err);
      toast.error(err.response?.data?.message || 'Failed to delete city');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      {/* Page Header */}
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-medium mb-2">Manage Cities</h1>
          <p className=" text-sm">Add, edit, or remove cities for property listings.</p>
        </div>
        <button
          onClick={handleAdd}
          className="bg-primary hover:bg-primary-dark cursor-pointer px-6 py-2 rounded-lg flex items-center gap-2 font-medium text-white whitespace-nowrap"
        >
          <Plus size={20} /> Add City
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-neutral-800 rounded-lg max-w-md w-full border border-neutral-200 dark:border-neutral-700">
            <div className="border-b border-neutral-200 dark:border-neutral-700 p-6">
              <h2 className="text-2xl font-medium">
                {editingId ? 'Edit City' : 'Add New City'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium mb-2 uppercase tracking-wide">
                  City Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ name: e.target.value })}
                  placeholder="e.g., Ktm, Pokhara"
                  className="w-full pl-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm transition"
                  disabled={submitting}
                  autoFocus
                />
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={submitting}
                  className="px-4 py-2 bg-neutral-200 cursor-pointer hover:bg-neutral-300 dark:bg-neutral-700 dark:hover:bg-neutral-600 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 bg-primary cursor-pointer text-white hover:bg-primary-dark rounded-lg font-medium transition-colors duration-200 disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : editingId ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-neutral-800 rounded-lg max-w-md w-full border border-neutral-200 dark:border-neutral-700">
            <div className="border-b border-neutral-200 dark:border-neutral-700 p-6">
              <h2 className="text-xl font-medium">
                Delete City?
              </h2>
            </div>

            <div className="p-6">
              <p className=" mb-6 leading-relaxed">
                Are you sure you want to delete <span className="font-medium">{deleteConfirm.name}</span>? This action cannot be undone.
              </p>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  disabled={submitting}
                  className="px-4 py-2 bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-700 dark:hover:bg-neutral-600 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm._id)}
                  disabled={submitting}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50"
                >
                  {submitting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin inline-block w-8 h-8 border-4 border-neutral-200 dark:border-neutral-700 border-t-primary rounded-full mb-4"></div>
            <p className="font-medium">Loading cities...</p>
          </div>
        </div>
      ) : cities.length === 0 ? (
        <div className="flex items-center justify-center min-h-[60vh] bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700">
          <div className="text-center">
            <p className="font-medium mb-3">No cities yet</p>
            <p className="text-sm mb-6 max-w-xs">Get started by adding your first city to the platform</p>
            <button
              onClick={handleAdd}
              className="bg-primary hover:bg-primary-dark cursor-pointer px-6 py-2 rounded-lg font-medium transition-colors inline-flex items-center gap-2"
            >
              <Plus size={18} /> Add the first city
            </button>
          </div>
        </div>
      ) : (
        <div className="relative overflow-x-auto bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700">
          <table className="w-full text-sm text-left">
            <thead className="text-xs bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-700 uppercase tracking-wide font-medium">
              <tr>
                <th scope="col" className="px-6 py-4">
                  City Name
                </th>
                <th scope="col" className="px-6 py-4 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {cities.map((city) => (
                <tr
                  key={city._id}
                  className="bg-white dark:bg-neutral-800 border-b border-neutral-100 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors duration-200"
                >
                  <td className="px-6 py-4 font-medium">
                    {city.name}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEdit(city)}
                        className="bg-blue-600 hover:bg-blue-700 cursor-pointer text-white px-3 py-2 rounded-lg flex items-center gap-2 text-sm font-medium"
                      >
                        <Edit2 size={16} /> Edit
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(city)}
                        className="bg-red-600 hover:bg-red-700 cursor-pointer text-white px-3 py-2 rounded-lg flex items-center gap-2 text-sm font-medium"
                      >
                        <Trash2 size={16} /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}
