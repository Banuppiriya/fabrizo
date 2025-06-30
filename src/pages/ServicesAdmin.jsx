import React, { useEffect, useState } from 'react';
import { adminApi } from '../api';

function ServicesAdmin() {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', price: '', category: '', file: null });
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminApi.getServices();
      setServices(data);
    } catch (err) {
      setError('Failed to load services.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async () => {
    setLoading(true);
    setError(null);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => v != null && fd.append(k, v));
      if (editing) {
        await adminApi.updateService(editing._id, fd);
      } else {
        await adminApi.createService(fd);
      }
      setForm({ title: '', description: '', price: '', category: '', file: null });
      setEditing(null);
      await load();
    } catch (err) {
      setError('Failed to save service.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete service?')) return;
    setLoading(true);
    setError(null);
    try {
      await adminApi.deleteService(id);
      await load();
    } catch (err) {
      setError('Failed to delete service.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Manage Services</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      <div className="space-y-2 mb-6 max-w-md">
        {['title', 'description', 'price', 'category'].map(f => (
          <input
            key={f}
            value={form[f]}
            placeholder={f}
            onChange={e => setForm({ ...form, [f]: e.target.value })}
            className="w-full border px-3 py-2 rounded"
            disabled={loading}
          />
        ))}
        <input
          key={form.file ? form.file.name : 'file-input'}
          type="file"
          onChange={e => setForm({ ...form, file: e.target.files[0] })}
          disabled={loading}
        />
        {form.file && (
          <img
            src={URL.createObjectURL(form.file)}
            alt="Preview"
            className="mt-2 w-32 h-32 object-cover rounded"
          />
        )}
        <div className="flex items-center space-x-2">
          <button
            onClick={submit}
            disabled={
              loading || !form.title || !form.description || !form.price || !form.category
            }
            className="px-4 py-2 bg-indigo-600 text-white disabled:opacity-50 rounded"
          >
            {loading ? (editing ? 'Updating...' : 'Creating...') : editing ? 'Update Service' : 'Create Service'}
          </button>
          {editing && (
            <button
              onClick={() => {
                setEditing(null);
                setForm({ title: '', description: '', price: '', category: '', file: null });
                setError(null);
              }}
              disabled={loading}
              className="px-4 py-2 bg-gray-300 rounded"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {loading && !services.length && (
        <div>Loading services...</div>
      )}

      <ul className="space-y-4 max-w-md">
        {services.map(s => (
          <li key={s._id} className="border p-4 rounded flex justify-between items-center">
            <div>
              <h3 className="font-semibold">{s.title}</h3>
              <p>${s.price} — {s.category}</p>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => {
                  setEditing(s);
                  setForm({ ...s, file: null });
                  setError(null);
                }}
                disabled={loading}
                className="px-3 py-1 bg-yellow-400 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => remove(s._id)}
                disabled={loading}
                className="px-3 py-1 text-red-600 rounded border border-red-600"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ServicesAdmin;
