// src/pages/Services.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/axiosInstance';
import ServiceFormModal from '../components/ServiceFormModal';
import { Edit, Trash2, PlusCircle, ToggleRight, ToggleLeft, Loader2 } from 'lucide-react';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentService, setCurrentService] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionServiceId, setActionServiceId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const ITEMS_PER_PAGE = 5;

  const navigate = useNavigate();

  const fetchServices = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/services', {
        params: { page: currentPage, limit: ITEMS_PER_PAGE },
      });
      const serviceArr = Array.isArray(data.services) ? data.services : [];
      const formattedServices = serviceArr.map(service => ({
        ...service,
        isActive: service.hasOwnProperty('isActive') ? service.isActive : true,
      }));
      setServices(formattedServices);
      setTotalItems(data.total || 0);
    } catch (err) {
      console.error('Error fetching services:', err);
      setError('Failed to load services. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const handleAddService = () => {
    setCurrentService(null);
    setIsModalOpen(true);
  };

  const handleEditService = (service) => {
    setCurrentService(service);
    setIsModalOpen(true);
  };

  const handleDeleteService = async (serviceId) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    setActionLoading(true);
    setActionServiceId(serviceId);
    setError('');
    try {
      await api.delete(`/services/${serviceId}`);
      alert('Service deleted successfully!');
      fetchServices();
    } catch (err) {
      console.error('Error deleting service:', err);
      setError(err.response?.data?.message || 'Failed to delete service.');
    } finally {
      setActionLoading(false);
      setActionServiceId(null);
    }
  };

  const handleToggleActiveStatus = async (serviceId, currentIsActive) => {
    setActionLoading(true);
    setActionServiceId(serviceId);
    setError('');
    try {
      setServices(prev =>
        prev.map(service =>
          service._id === serviceId ? { ...service, isActive: !currentIsActive } : service
        )
      );
      await api.put(`/services/${serviceId}`, { isActive: !currentIsActive });
    } catch (err) {
      console.error(`Error toggling service status:`, err);
      setError(err.response?.data?.message || 'Failed to toggle service status.');
      fetchServices();
    } finally {
      setActionLoading(false);
      setActionServiceId(null);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setCurrentService(null);
    fetchServices();
  };

  // UPDATED: Navigate to fixed /order path (no id)
  const handleCardClick = () => {
    navigate('/order'); // No ID passed now, just a placeholder
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#F2E1C1] text-[#1C1F43]">
        <Loader2 className="animate-spin text-[#B26942] mb-4" size={48} />
        <p className="text-xl font-semibold">Loading services...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-50">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center border border-red-300">
          <p className="text-red-700 font-bold text-lg mb-4">Error!</p>
          <p className="text-gray-700">{error}</p>
          <button
            onClick={fetchServices}
            className="mt-6 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-300 py-12 min-h-screen font-['Montserrat']">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          <h1 className="text-4xl font-extrabold font-['Playfair_Display']" style={{ color: '#1C1F43' }}>
            Manage Tailoring Services
          </h1>
          <button
            onClick={handleAddService}
            className="font-semibold py-3 px-6 rounded-lg flex items-center text-lg shadow-lg hover:shadow-xl group"
            style={{ backgroundColor: '#1C1F43', color: '#F2E1C1' }}
            disabled={actionLoading}
          >
            {actionLoading && actionServiceId === null ? (
              <Loader2 className="animate-spin mr-2" size={20} />
            ) : (
              <PlusCircle className="mr-2 group-hover:rotate-90 transition-transform" size={20} />
            )}
            Add New Service
          </button>
        </div>
        {services.length === 0 ? (
          <div className="text-center text-xl text-[#3B3F4C] py-20 bg-white rounded-lg shadow-xl border border-gray-200">
            No services found. Click "Add New Service" to get started!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div
                key={service._id}
                className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col cursor-pointer"
                onClick={handleCardClick}
              >
                <div className="relative h-48 w-full">
                  {service.imageUrl ? (
                    <img
                      src={service.imageUrl}
                      alt={service.title}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/400x200?text=No+Image";
                      }}
                    />
                  ) : (
                    <div className="h-full w-full bg-gray-100 flex items-center justify-center text-gray-500 text-sm border border-dashed border-gray-300">
                      No Image Available
                    </div>
                  )}
                  <span className={`absolute top-3 right-3 px-3 py-1 text-xs font-semibold rounded-full ${
                    service.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {service.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-2xl font-semibold font-['Playfair_Display'] text-[#1C1F43] mb-2 truncate">
                    {service.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">Category:</span> {service.category || 'N/A'}
                  </p>
                  <p className="text-base text-gray-700 line-clamp-3 mb-4 flex-grow">
                    {service.description || 'No description available.'}
                  </p>
                  <p className="text-xl font-bold text-[#B26942] mb-4">
                    {new Intl.NumberFormat('en-LK', {
                      style: 'currency',
                      currency: 'LKR',
                    }).format(service.price || 0)}
                  </p>

                  <div className="flex justify-around items-center mt-auto border-t pt-4">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleToggleActiveStatus(service._id, service.isActive); }}
                      className={`p-2 rounded-full ${
                        service.isActive ? 'bg-green-50 text-green-700 hover:bg-green-100'
                        : 'bg-red-50 text-red-700 hover:bg-red-100'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                      title={service.isActive ? 'Deactivate' : 'Activate'}
                      disabled={actionLoading && actionServiceId === service._id}
                    >
                      {actionLoading && actionServiceId === service._id ? (
                        <Loader2 className="animate-spin" size={20} />
                      ) : (
                        service.isActive ? <ToggleRight size={20} /> : <ToggleLeft size={20} />
                      )}
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleEditService(service); }}
                      className="text-[#B26942] hover:text-[#8C4F2C] p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Edit"
                      disabled={actionLoading && actionServiceId === service._id}
                    >
                      <Edit size={20} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDeleteService(service._id); }}
                      className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Delete"
                      disabled={actionLoading && actionServiceId === service._id}
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <ServiceFormModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onSuccess={handleModalClose}
          serviceToEdit={currentService}
        />
      )}

      {/* Pagination Controls */}
      {totalItems > ITEMS_PER_PAGE && (
        <div className="flex justify-center mt-8 space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage <= 1}
            className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Previous
          </button>
          {Array.from({ length: Math.ceil(totalItems / ITEMS_PER_PAGE) }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-4 py-2 border rounded-md shadow-sm text-sm font-medium transition ${
                currentPage === page
                  ? 'bg-indigo-600 text-white shadow-indigo-300/50'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={currentPage >= Math.ceil(totalItems / ITEMS_PER_PAGE)}
            className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Services;
