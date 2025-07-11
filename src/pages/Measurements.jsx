// src/pages/Measurements.jsx
import React, { useEffect, useState } from 'react';
import api from '../utils/axiosInstance';

const Measurements = ({ serviceId }) => {
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
  const [saving, setSaving] = useState(false);
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

  // Helper to convert string inputs to numbers or 0
  const toNumericMeasurements = (measurements) =>
    Object.fromEntries(
      Object.entries(measurements).map(([key, value]) => [key, Number(value) || 0])
    );

  const handleSubmitMeasurements = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      const numericUpperBody = toNumericMeasurements(upperBody);
      const numericLowerBody = toNumericMeasurements(lowerBody);

      await api.post('/measurements', { upperBody: numericUpperBody, lowerBody: numericLowerBody });
      setSuccess('Measurements saved successfully!');
    } catch (err) {
      console.error(err);
      setError('Failed to save measurements.');
    } finally {
      setSaving(false);
    }
  };

  const handleCreateOrder = async () => {
    setOrderError('');
    setOrderSuccess('');
    setCreatingOrder(true);

    // Basic validation: check if all fields have values (non-empty strings)
    const hasEmptyUpper = Object.values(upperBody).some((v) => v === '');
    const hasEmptyLower = Object.values(lowerBody).some((v) => v === '');

    if (hasEmptyUpper || hasEmptyLower) {
      setOrderError('Please fill all measurement fields before creating an order.');
      setCreatingOrder(false);
      return;
    }

    if (!serviceId) {
      setOrderError('No service selected for the order.');
      setCreatingOrder(false);
      return;
    }

    try {
      const numericUpperBody = toNumericMeasurements(upperBody);
      const numericLowerBody = toNumericMeasurements(lowerBody);

      await api.post('/order', {
        service: serviceId,
        designDetails: 'Custom design', // You can make this dynamic too
        measurements: {
          upperBody: numericUpperBody,
          lowerBody: numericLowerBody,
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
                type="number"
                value={value}
                onChange={handleUpperBodyChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
                placeholder={`Enter ${key.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
                min="0"
                step="0.1"
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
                type="number"
                value={value}
                onChange={handleLowerBodyChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
                placeholder={`Enter ${key.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
                min="0"
                step="0.1"
              />
            </div>
          ))}
        </fieldset>

        <button
          type="submit"
          disabled={saving}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Measurements'}
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
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
        >
          {creatingOrder ? 'Creating Order...' : 'Create Order'}
        </button>
      </div>
    </div>
  );
};

export default Measurements;
