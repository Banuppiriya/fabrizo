// src/pages/AdminServiceManagement.jsx (or Services.jsx)
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import api from '../utils/axiosInstance'; // Make sure this is correctly configured for your backend API base URL
import ServiceFormModal from '../components/ServiceFormModal'; // CORRECTED IMPORT PATH! Assuming it's in components folder
import { Edit, Trash2, PlusCircle, ToggleRight, ToggleLeft, Loader2 } from 'lucide-react'; // Added ToggleRight, ToggleLeft icons, Loader2

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentService, setCurrentService] = useState(null); // Service object for editing, null for creating
  const [actionLoading, setActionLoading] = useState(false); // New state for action-specific loading (delete/toggle)
  const [actionServiceId, setActionServiceId] = useState(null); // Track which service is undergoing an action

  const navigate = useNavigate(); // Initialize useNavigate

  // Function to fetch services
  const fetchServices = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/services'); // Your backend route for getting all services
      // Ensure each service object has an 'isActive' property, defaulting to true if not present
      const formattedServices = data.map(service => ({
        ...service,
        isActive: service.hasOwnProperty('isActive') ? service.isActive : true // Default to true if missing
      }));
      setServices(formattedServices);
    } catch (err) {
      console.error('Error fetching services:', err);
      setError('Failed to load services. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const handleAddService = () => {
    setCurrentService(null); // Clear any service for editing
    setIsModalOpen(true);
  };

  const handleEditService = (service) => {
    // Stop event propagation if this is triggered by a nested button click
    // event.stopPropagation(); // If this function is also on the card itself
    setCurrentService(service); // Set the service to be edited
    setIsModalOpen(true);
  };

  const handleDeleteService = async (serviceId) => {
    // event.stopPropagation(); // Stop event propagation if this is triggered by a nested button click
    if (!window.confirm('Are you sure you want to delete this service? This action cannot be undone.')) {
      return;
    }
    setActionLoading(true); // Start action-specific loading
    setActionServiceId(serviceId); // Identify which service is being acted upon
    setError('');
    try {
      await api.delete(`/services/${serviceId}`); // Your backend route for deleting service
      alert('Service deleted successfully!');
      fetchServices(); // Re-fetch services to update the list
    } catch (err) {
      console.error('Error deleting service:', err);
      setError(err.response?.data?.message || 'Failed to delete service. Please try again.');
    } finally {
      setActionLoading(false); // End action-specific loading
      setActionServiceId(null); // Clear action ID
    }
  };

  // Function to toggle service active status
  const handleToggleActiveStatus = async (serviceId, currentIsActive) => {
    // event.stopPropagation(); // Stop event propagation if this is triggered by a nested button click
    setActionLoading(true); // Start action-specific loading
    setActionServiceId(serviceId); // Identify which service is being acted upon
    setError('');
    try {
      // Optimistic UI update
      setServices(prevServices =>
        prevServices.map(service =>
          service._id === serviceId ? { ...service, isActive: !currentIsActive } : service
        )
      );

      await api.put(`/services/${serviceId}`, { isActive: !currentIsActive }); // Backend endpoint to update service
      // No alert needed if optimistic update is smooth. If you must, consider a toast notification.
      // alert(`Service status toggled to ${!currentIsActive ? 'Active' : 'Inactive'} successfully!`);
    } catch (err) {
      console.error(`Error toggling service status for ${serviceId}:`, err);
      setError(err.response?.data?.message || `Failed to toggle service status. Please try again.`);
      // Revert UI by re-fetching the actual state from the backend
      fetchServices();
    } finally {
      setActionLoading(false); // End action-specific loading
      setActionServiceId(null); // Clear action ID
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setCurrentService(null); // Clear current service when modal closes
    fetchServices(); // Re-fetch services to reflect any changes made in the modal (add/edit)
  };

  // NEW: Handle service card click
  const handleCardClick = (serviceId) => {
    // Navigate to the order page, passing the service ID as a URL parameter
    navigate(`Order/${serviceId}`);
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
            className="mt-6 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F2E1C1] py-12 min-h-screen font-['Montserrat']">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          <h1 className="text-4xl font-extrabold font-['Playfair_Display'] text-[#1C1F43] text-center md:text-left">
            Manage Tailoring Services
          </h1>
          <button
            onClick={handleAddService}
            className="bg-[#1C1F43] hover:bg-[#3B3F4C] text-[#F2E1C1] font-semibold py-3 px-6 rounded-lg flex items-center justify-center transition-colors shadow-lg hover:shadow-xl text-lg group"
            disabled={actionLoading} // Disable button during ongoing actions
          >
            {actionLoading && actionServiceId === null ? ( // Only show loader for general add action
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
                className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col cursor-pointer" // Add cursor-pointer
                onClick={() => handleCardClick(service._id)} // Add onClick to the card
              >
                <div className="relative h-48 w-full">
                  {service.imageUrl ? (
                    <img
                      src={service.imageUrl}
                      alt={service.title}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/400x200?text=No+Image"; // A clear placeholder
                        e.target.className = "h-full w-full object-contain bg-gray-100 flex items-center justify-center text-gray-500 text-xs border border-dashed border-gray-300";
                      }}
                    />
                  ) : (
                    <div className="h-full w-full bg-gray-100 flex items-center justify-center text-gray-500 text-sm border border-dashed border-gray-300">No Image Available</div>
                  )}
                  <span className={`absolute top-3 right-3 px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${
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
                    {new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR' }).format(service.price || 0)}
                  </p>

                  {/* Actions Buttons - Ensure these stop propagation if clicked directly */}
                  <div className="flex justify-around items-center mt-auto border-t pt-4">
                    {/* Toggle Active Status Button */}
                    <button
                      onClick={(e) => { e.stopPropagation(); handleToggleActiveStatus(service._id, service.isActive); }} // Stop propagation
                      className={`p-2 rounded-full transition-colors duration-200 ${
                          service.isActive
                            ? 'bg-green-50 text-green-700 hover:bg-green-100'
                            : 'bg-red-50 text-red-700 hover:bg-red-100'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                      title={service.isActive ? 'Deactivate Service' : 'Activate Service'}
                      disabled={actionLoading && actionServiceId === service._id}
                    >
                      {actionLoading && actionServiceId === service._id ? (
                        <Loader2 className="animate-spin" size={20} />
                      ) : (
                        service.isActive ? <ToggleRight size={20} /> : <ToggleLeft size={20} />
                      )}
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleEditService(service); }} // Stop propagation
                      className="text-[#B26942] hover:text-[#8C4F2C] transition-colors p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Edit Service"
                      disabled={actionLoading && actionServiceId === service._id}
                    >
                      {actionLoading && actionServiceId === service._id ? (
                        <Loader2 className="animate-spin" size={20} />
                      ) : (
                        <Edit size={20} />
                      )}
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDeleteService(service._id); }} // Stop propagation
                      className="text-red-600 hover:text-red-800 transition-colors p-2 rounded-full hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Delete Service"
                      disabled={actionLoading && actionServiceId === service._id}
                    >
                      {actionLoading && actionServiceId === service._id ? (
                        <Loader2 className="animate-spin" size={20} />
                      ) : (
                        <Trash2 size={20} />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Service Form Modal */}
      {isModalOpen && (
        <ServiceFormModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onSuccess={handleModalClose}
          serviceToEdit={currentService}
        />
      )}
    </div>
  );
};

export default Services;