import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { theme } from '../theme';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

function ServicesAdmin() {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', price: '', category: '', file: null });
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/service');
      setServices(data);
    } catch (err) {
      setError('Failed to load services.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => v != null && fd.append(k, v));
      if (editing) {
        await axios.put(`/service/${editing._id}`, fd);
      } else {
        await axios.post('/service', fd);
      }
      resetForm();
      await load();
    } catch (err) {
      setError('Failed to save service.');
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete service?')) return;
    setLoading(true);
    try {
      await axios.delete(`/services/${id}`);
      await load();
    } catch (err) {
      setError('Failed to delete service.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({ title: '', description: '', price: '', category: '', file: null });
    setEditing(null);
    setError(null);
  };

  return (
    <div>
      <h1 style={{ color: theme.colors.primary, fontFamily: theme.fonts.heading }} className="text-3xl font-bold mb-6">
        Manage Services
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <ServiceForm form={form} setForm={setForm} editing={editing} loading={loading} submit={submit} resetForm={resetForm} />
        </div>
        <div className="lg:col-span-2">
          {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}
          <ServiceList services={services} setForm={setForm} setEditing={setEditing} remove={remove} loading={loading} />
        </div>
      </div>
    </div>
  );
}

const ServiceForm = ({ form, setForm, editing, loading, submit, resetForm }) => (
  <form onSubmit={submit} className="bg-white p-6 rounded-lg shadow-lg space-y-4">
    <h2 style={{ color: theme.colors.text, fontFamily: theme.fonts.heading }} className="text-xl font-semibold">
      {editing ? 'Edit Service' : 'Add New Service'}
    </h2>
    <input value={form.title} placeholder="Title" onChange={e => setForm({ ...form, title: e.target.value })} className="w-full border p-2 rounded" disabled={loading} />
    <textarea value={form.description} placeholder="Description" onChange={e => setForm({ ...form, description: e.target.value })} className="w-full border p-2 rounded" disabled={loading} />
    <input value={form.price} placeholder="Price" type="number" onChange={e => setForm({ ...form, price: e.target.value })} className="w-full border p-2 rounded" disabled={loading} />
    <input value={form.category} placeholder="Category" onChange={e => setForm({ ...form, category: e.target.value })} className="w-full border p-2 rounded" disabled={loading} />
    <input type="file" onChange={e => setForm({ ...form, file: e.target.files[0] })} disabled={loading} />
    {form.file && <img src={URL.createObjectURL(form.file)} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded" />}
    <div className="flex space-x-2">
      <button type="submit" disabled={loading || !form.title} style={{ backgroundColor: theme.colors.primary, color: 'white' }} className="px-4 py-2 rounded disabled:opacity-50">
        {loading ? 'Saving...' : (editing ? 'Update' : 'Create')}
      </button>
      {editing && <button type="button" onClick={resetForm} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>}
    </div>
  </form>
);

const ServiceList = ({ services, setForm, setEditing, remove, loading }) => (
  <div className="bg-white p-6 rounded-lg shadow-lg">
    {loading && !services.length && <p>Loading services...</p>}
    <ul className="space-y-4">
      {services.map(s => (
        <li key={s._id} className="border p-4 rounded-lg flex justify-between items-center">
          <div>
            <h3 className="font-semibold">{s.title}</h3>
            <p>${s.price} — {s.category}</p>
          </div>
          <div className="space-x-2">
            <button onClick={() => { setEditing(s); setForm({ ...s, file: null }); }} disabled={loading} className="p-2 text-yellow-500 hover:text-yellow-700">
              <FaEdit />
            </button>
            <button onClick={() => remove(s._id)} disabled={loading} className="p-2 text-red-500 hover:text-red-700">
              <FaTrash />
            </button>
          </div>
        </li>
      ))}
    </ul>
  </div>
);

export default ServicesAdmin;