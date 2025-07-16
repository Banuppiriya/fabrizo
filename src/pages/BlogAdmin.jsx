import React, { useEffect, useState } from 'react';
import api from '../utils/axiosInstance';

const emptyArticle = { slug: '', title: '', date: '', content: '', category: '' };

const BlogAdmin = () => {
  const [articles, setArticles] = useState([]);
  const [form, setForm] = useState(emptyArticle);
  const [customCategory, setCustomCategory] = useState('');
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchArticles = () => {
    setLoading(true);
    api.get('/blog')
      .then(res => setArticles(res.data))
      .catch(() => setError('Failed to load articles'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    setLoading(true);
    const req = editing
      ? api.put(`/blog/${editing.slug}`, form)
      : api.post('/blog', form);
    req.then(() => {
      setForm(emptyArticle);
      setEditing(null);
      fetchArticles();
    })
      .catch(() => setError('Save failed'))
      .finally(() => setLoading(false));
  };

  const handleEdit = article => {
    setForm(article);
    setEditing(article);
  };

  const handleDelete = slug => {
    if (!window.confirm('Delete this article?')) return;
    setLoading(true);
    api.delete(`/blog/${slug}`)
      .then(fetchArticles)
      .catch(() => setError('Delete failed'))
      .finally(() => setLoading(false));
  };

  // Collect unique categories from all articles
  // Always include the current form.category if not in the list (for edit mode)
  const categories = Array.from(new Set([
    ...articles.map(a => a.category).filter(Boolean),
    form.category && !articles.map(a => a.category).includes(form.category) ? form.category : null
  ].filter(Boolean)));

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Blog Admin</h1>
      <form onSubmit={handleSubmit} className="mb-8 space-y-4 bg-white dark:bg-gray-800 p-6 rounded shadow">
        <div>
          <label className="block mb-1 font-semibold">Category</label>
          <select
            name="category"
            value={categories.includes(form.category) && !customCategory ? form.category : '__custom'}
            onChange={e => {
              if (e.target.value === '__custom') {
                setCustomCategory(form.category && !categories.includes(form.category) ? form.category : '');
                setForm(f => ({ ...f, category: '' }));
              } else {
                setCustomCategory('');
                setForm(f => ({ ...f, category: e.target.value }));
              }
            }}
            className="w-full p-2 border rounded mb-2"
            required
          >
            <option value="">Select category</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
            <option value="__custom">Other (type below)</option>
          </select>
          {(customCategory || (!categories.includes(form.category) && !form.category)) && (
            <input
              name="customCategory"
              value={customCategory}
              onChange={e => {
                setCustomCategory(e.target.value);
                setForm(f => ({ ...f, category: e.target.value }));
              }}
              placeholder="Enter custom category"
              className="w-full p-2 border rounded mt-2"
              required
            />
          )}
        </div>
        <input
          name="slug"
          value={form.slug}
          onChange={handleChange}
          placeholder="Slug (e.g. fabric-selection)"
          className="w-full p-2 border rounded"
          required
          disabled={!!editing}
        />
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Title"
          className="w-full p-2 border rounded"
          required
        />
        <input
          name="date"
          value={form.date}
          onChange={handleChange}
          placeholder="Date (e.g. July 30, 2024)"
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          name="content"
          value={form.content}
          onChange={handleChange}
          placeholder="Content (HTML allowed)"
          className="w-full p-2 border rounded h-32"
          required
        />
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
          {editing ? 'Update' : 'Create'} Article
        </button>
        {editing && (
          <button type="button" className="ml-2 px-4 py-2 bg-gray-400 text-white rounded" onClick={() => { setForm(emptyArticle); setEditing(null); }}>
            Cancel
          </button>
        )}
      </form>
      {error && <div className="text-red-600 mb-4">{error}</div>}
      {loading && <div className="text-neutral-500 mb-4">Loading...</div>}
      <table className="w-full text-left border">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-700">
            <th className="p-2">Slug</th>
            <th className="p-2">Title</th>
            <th className="p-2">Date</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {articles.map(a => (
            <tr key={a.slug} className="border-t">
              <td className="p-2">{a.slug}</td>
              <td className="p-2">{a.title}</td>
              <td className="p-2">{a.date}</td>
              <td className="p-2 space-x-2">
                <button className="px-2 py-1 bg-yellow-500 text-white rounded" onClick={() => handleEdit(a)}>Edit</button>
                <button className="px-2 py-1 bg-red-600 text-white rounded" onClick={() => handleDelete(a.slug)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BlogAdmin;
