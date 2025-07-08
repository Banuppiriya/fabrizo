// src/pages/Measurements.jsx
import React, { useEffect, useState } from 'react';
import api from '../utils/axiosInstance';

const Measurements = () => {
  const [upperBody, setUpperBody] = useState({
    chest: '',
    shoulderWidth: '',
    armLength: '',
    bicep: '',
    neck: '',
  });
  const [lowerBody, setLowerBody] = useState({
    waist: '',
    hip: '',
    inseam: '',
    thigh: '',
    height: '',
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [orderSuccess, setOrderSuccess] = useState('');
  const [orderError, setOrderError] = useState('');
  const [creatingOrder, setCreatingOrder] = useState(false);

  useEffect(() => {
    const fetchMeasurements = async () => {
      try {
        const res = await api.get('/measurements/my');
        const data = res.data;

        setUpperBody({
          chest: data.upperBody.chest || '',
          shoulderWidth: data.upperBody.shoulderWidth || '',
          armLength: data.upperBody.armLength || '',
          bicep: data.upperBody.bicep || '',
          neck: data.upperBody.neck || '',
        });

        setLowerBody({
          waist: data.lowerBody.waist || '',
          hip: data.lowerBody.hip || '',
          inseam: data.lowerBody.inseam || '',
          thigh: data.lowerBody.thigh || '',
          height: data.lowerBody.height || '',
        });

        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Failed to load measurements.');
        setLoading(false);
      }
    };

    fetchMeasurements();
  }, []);

  const handleUpperBodyChange = (e) => {
    setUpperBody({ ...upperBody, [e.target.name]: e.target.value });
  };

  const handleLowerBodyChange = (e) => {
    setLowerBody({ ...lowerBody, [e.target.name]: e.target.value });
  };

  const handleSubmitMeasurements = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await api.post('/measurements', { upperBody, lowerBody });
      setSuccess('Measurements saved successfully!');
    } catch (err) {
      console.error(err);
      setError('Failed to save measurements.');
    }
  };

  // New function to create order with current measurements
  const handleCreateOrder = async () => {
    setOrderError('');
    setOrderSuccess('');
    setCreatingOrder(true);

    try {
      // For example, sending service id and measurements to backend order creation
      await api.post('/order', {
        service: 'SERVICE_ID_HERE', // replace with real service id
        designDetails: 'Custom design', // optionally add design details
        measurements: {
          upperBody,
          lowerBody,
        },
      });
      setOrderSuccess('Order created successfully!');
    } catch (err) {
      console.error(err);
      setOrderError('Failed to create order.');
    } finally {
      setCreatingOrder(false);
    }
  };

  if (loading) return <p>Loading measurements...</p>;

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Your Measurements</h1>

      {error && <p className="text-red-600 mb-3">{error}</p>}
      {success && <p className="text-green-600 mb-3">{success}</p>}

      <form onSubmit={handleSubmitMeasurements}>
        <fieldset className="mb-6">
          <legend className="font-semibold mb-2">Upper Body</legend>
          {Object.entries(upperBody).map(([key, value]) => (
            <div key={key} className="mb-3">
              <label htmlFor={key} className="block text-sm font-medium mb-1 capitalize">
                {key.replace(/([A-Z])/g, ' $1')}
              </label>
              <input
                id={key}
                name={key}
                type="text"
                value={value}
                onChange={handleUpperBodyChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
                placeholder={`Enter ${key.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
              />
            </div>
          ))}
        </fieldset>

        <fieldset className="mb-6">
          <legend className="font-semibold mb-2">Lower Body</legend>
          {Object.entries(lowerBody).map(([key, value]) => (
            <div key={key} className="mb-3">
              <label htmlFor={key} className="block text-sm font-medium mb-1 capitalize">
                {key.replace(/([A-Z])/g, ' $1')}
              </label>
              <input
                id={key}
                name={key}
                type="text"
                value={value}
                onChange={handleLowerBodyChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
                placeholder={`Enter ${key.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
              />
            </div>
          ))}
        </fieldset>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save Measurements
        </button>
      </form>

      <hr className="my-6" />

      <div>
        <h2 className="text-xl font-semibold mb-3">Create Order with These Measurements</h2>
        {orderError && <p className="text-red-600 mb-3">{orderError}</p>}
        {orderSuccess && <p className="text-green-600 mb-3">{orderSuccess}</p>}
        <button
          onClick={handleCreateOrder}
          disabled={creatingOrder}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          {creatingOrder ? 'Creating Order...' : 'Create Order'}
        </button>
      </div>
    </div>
  );
};

export default Measurements;
