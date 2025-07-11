// src/components/ServiceFormModal.jsx
import React, { useState, useEffect } from 'react';
import api from '../utils/axiosInstance';
import { X, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ServiceFormModal = ({ isOpen, onClose, onSuccess, serviceToEdit }) => {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    price: '',
    description: '',
    isActive: true,
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate(); // <-- Add navigation hook

  useEffect(() => {
    if (serviceToEdit) {
      setFormData({
        title: serviceToEdit.title || '',
        category: serviceToEdit.category || '',
        price: serviceToEdit.price || '',
        description: serviceToEdit.description || '',
        isActive: serviceToEdit.hasOwnProperty('isActive') ? serviceToEdit.isActive : true,
      });
      setImageFile(null);
    } else {
      setFormData({
        title: '',
        category: '',
        price: '',
        description: '',
        isActive: true,
      });
      setImageFile(null);
    }
    setError('');
  }, [serviceToEdit, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0] || null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('category', formData.category);
      data.append('price', formData.price);
      data.append('description', formData.description);
      data.append('isActive', formData.isActive);
      if (imageFile) {
        data.append('image', imageFile);
      }

      if (serviceToEdit) {
        await api.put(`/services/${serviceToEdit._id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        alert('Service updated successfully!');
      } else {
        await api.post('/services', data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        alert('Service added successfully!');
      }

      onSuccess(); // optional callback
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setError('');
        navigate('/login', { replace: true });
        return;
      }
      console.error('Error saving service:', err.response?.data || err);
      setError(err.response?.data?.message || 'Failed to save service. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
          title="Close"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold font-['Playfair_Display'] text-[#1C1F43] mb-6 border-b pb-3">
          {serviceToEdit ? 'Edit Service' : 'Add New Service'}
        </h2>

        {error && (
          <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-sm border border-red-200">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-[#B26942] focus:border-[#B26942]"
              required
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
            <input
              type="text"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-[#B26942] focus:border-[#B26942]"
              required
            />
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-[#B26942] focus:border-[#B26942]"
              step="0.01"
              required
            />
          </div>

          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700">Upload Image</label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-1 block w-full"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-[#B26942] focus:border-[#B26942]"
              required
            ></textarea>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="h-4 w-4 text-[#1C1F43] focus:ring-[#B26942] border-gray-300 rounded"
            />
            <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
              Service is Active (Visible to users)
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#B26942]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-5 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#1C1F43] hover:bg-[#3B3F4C] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#B26942]"
            >
              <Save size={16} className="mr-2" /> {loading ? 'Saving...' : 'Save Service'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServiceFormModal;
